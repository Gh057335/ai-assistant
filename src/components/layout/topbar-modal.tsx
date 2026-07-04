"use client";

import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface TopbarModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name — wired to aria-labelledby, shown in the header. */
  title: string;
  /** Accessible description — wired to aria-describedby (visually hidden). */
  description?: string;
  /** Optional brand accent tinting the header dot. */
  accent?: string;
  /** Primary footer action. Selections apply live, so this commits + closes;
      defaults to onClose. */
  onSave?: () => void;
  saveLabel?: string;
  closeLabel?: string;
  className?: string;
  children: ReactNode;
}

// The single popup shell shared by every topbar trigger (each model tab, the
// Extra button, the Specialist button). Style, animation, backdrop, a11y, and
// the footer actions are defined here ONCE so every popup is identical — callers
// only vary the title and body.
//
// Responsive by design: on desktop it's a centered fade+scale modal; on mobile
// (≤640px) it becomes a full-width bottom sheet that slides up (the DrawerDemo
// pattern) with a grabber handle, a scrollable body, and large touch-target
// footer buttons. Mirrors the Drawer's shadcn/Vaul-style dialog contract
// (role="dialog", aria-modal, Title→aria-labelledby, Description→aria-describedby,
// focus trap, Escape-to-close, focus restore to the trigger, body scroll lock),
// hand-rolled on the repo's Framer Motion — no new dependency. Transform/opacity
// only → GPU-composited.
export function TopbarModal({
  open,
  onClose,
  title,
  description,
  accent,
  onSave,
  saveLabel = "Save",
  closeLabel = "Close",
  className,
  children,
}: TopbarModalProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const handleSave = onSave ?? onClose;

  // Lock body scroll, move focus into the panel, and restore focus to the
  // previously-focused element (the trigger) on close.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Slide up on mobile, fade+scale on desktop; flattened under reduced motion.
  const panelMotion = reduceMotion
    ? { initial: false as const, animate: {}, exit: {}, transition: { duration: 0 } }
    : isMobile
      ? {
          initial: { y: "100%" },
          animate: { y: 0 },
          exit: { y: "100%" },
          transition: { type: "tween" as const, duration: 0.3, ease: [0.32, 0.72, 0, 1] as const },
        }
      : {
          initial: { opacity: 0, scale: 0.96, y: 8 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.96, y: 8 },
          transition: { type: "spring" as const, stiffness: 380, damping: 30 },
        };

  return (
    <AnimatePresence>
      {open && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex justify-center",
            isMobile ? "items-end" : "items-start p-4 pt-[12vh]",
          )}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            onKeyDown={onKeyDown}
            initial={panelMotion.initial}
            animate={panelMotion.animate}
            exit={panelMotion.exit}
            transition={panelMotion.transition}
            style={{ willChange: "transform, opacity" }}
            className={cn(
              "relative flex flex-col overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)] shadow-2xl outline-none",
              isMobile
                ? "w-full max-h-[90vh] rounded-t-2xl pb-[env(safe-area-inset-bottom)]"
                : "w-full max-w-md max-h-[76vh] rounded-2xl",
              className,
            )}
          >
            {/* Grabber — the mobile drawer affordance. */}
            {isMobile && (
              <div className="flex shrink-0 justify-center pt-2.5" aria-hidden>
                <span className="h-1.5 w-10 rounded-full bg-[var(--border)]" />
              </div>
            )}

            <header className="flex shrink-0 items-center gap-2 border-b border-[var(--border)] px-4 py-3">
              {accent && (
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: accent }}
                  aria-hidden
                />
              )}
              <h2 id={titleId} className="text-sm font-semibold text-[var(--text-primary)]">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="ml-auto flex items-center justify-center rounded-md p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <X className="size-4" />
              </button>
            </header>

            {description && (
              <p id={descId} className="sr-only">
                {description}
              </p>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-hidden p-4">
              {children}
            </div>

            {/* Primary actions — stacked full-width on mobile for tap targets,
                a right-aligned row on desktop. */}
            <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-[var(--border)] p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-lg border border-[var(--border)] px-4 text-[14px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:h-9 sm:min-w-24"
              >
                {closeLabel}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="h-11 rounded-lg bg-[var(--text-primary)] px-4 text-[14px] font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:h-9 sm:min-w-24"
              >
                {saveLabel}
              </button>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
