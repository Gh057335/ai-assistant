"use client";

import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name — wired to aria-labelledby, shown in the header. */
  title: string;
  /** Accessible description — wired to aria-describedby (visually hidden). */
  description?: string;
  /** Edge the panel slides from. Full-width on phones, capped on ≥sm. */
  side?: "left" | "right";
  className?: string;
  children: ReactNode;
}

// Accessible slide-out drawer mirroring the shadcn/Vaul Radix Drawer semantics
// (role="dialog", aria-modal, Title→aria-labelledby, Description→aria-describedby,
// focus trap, Escape-to-close, focus restore to the trigger, body scroll lock),
// but built on the repo's existing Framer Motion — no new dependency. Movement
// is transform/opacity only, so it's GPU-composited with no layout shift.
export function Drawer({
  open,
  onClose,
  title,
  description,
  side = "right",
  className,
  children,
}: DrawerProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

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

  const closedX = side === "right" ? "100%" : "-100%";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
            className="absolute inset-0 bg-black/60"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            onKeyDown={onKeyDown}
            initial={{ x: closedX }}
            animate={{ x: 0 }}
            exit={{ x: closedX }}
            transition={reduceMotion ? { duration: 0 } : { type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            style={{ willChange: "transform" }}
            className={cn(
              "absolute inset-y-0 flex h-dvh w-full flex-col bg-[var(--bg-secondary)] shadow-2xl outline-none sm:max-w-sm",
              side === "right" ? "right-0" : "left-0",
              className,
            )}
          >
            <header className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
              <h2 id={titleId} className="text-sm font-semibold text-[var(--text-primary)]">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="ml-auto rounded-md p-1.5 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <X className="size-4" />
              </button>
            </header>
            {description && (
              <p id={descId} className="sr-only">
                {description}
              </p>
            )}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-hidden">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
