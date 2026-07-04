"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReasoningStep } from "@/types/message.types";

// Single seamless "timelapse" of what the assistant is doing — NOT a checklist.
// Only the current activity is shown; as work progresses the line cross-fades
// to the next phase in place, so the intermediate steps read as one continuous,
// evolving block rather than an accumulating bulleted list.
export function Timelapse({ steps }: { steps: ReasoningStep[] }) {
  const reduceMotion = useReducedMotion();
  const current = steps[steps.length - 1];
  if (!current) return null;

  return (
    <div className="mb-1 flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
      <motion.span
        aria-hidden
        className="size-1.5 shrink-0 rounded-full bg-[var(--accent)]"
        animate={reduceMotion ? undefined : { opacity: [1, 0.35, 1], scale: [1, 0.8, 1] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-r from-[var(--text-secondary)] via-[var(--text-primary)] to-[var(--text-secondary)] bg-[length:200%_100%] bg-clip-text text-transparent"
        >
          {current.label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
