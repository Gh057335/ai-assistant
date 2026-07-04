"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useProviderTheme } from "@/hooks/use-provider-theme";

// Publishes the active model's accent as `--accent` and paints a brand-tinted
// background that cross-fades whenever the model changes — so switching models
// re-themes the whole surface (accent + backdrop) in real time, with no loading
// state. Each model's `background` mirrors its product identity.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { modelId, background, style } = useProviderTheme();

  return (
    <div
      style={style}
      className="relative flex h-dvh w-full flex-col overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] [transition:--accent_450ms_ease-out]"
    >
      <AnimatePresence>
        <motion.div
          key={modelId}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ background }}
          className="pointer-events-none absolute inset-0"
        />
      </AnimatePresence>
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
