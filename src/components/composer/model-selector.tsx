"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { useDropdown } from "@/hooks/use-dropdown";
import { popupListVariants, usePopupRowVariants } from "@/components/agent-list";
import type { Model, ModelAvailability } from "@/types/model.types";
import { cn } from "@/lib/utils";

const DOT: Record<ModelAvailability, string> = {
  available: "bg-emerald-500",
  limited: "bg-amber-500",
  offline: "bg-red-500",
};

// Compact model switch. Kept in sync with the top provider bar — both call
// selectModel, so they can never disagree. Rendered in the composer on desktop
// and relocated into the top bar on narrow viewports (ChatLayout); `placement`
// only flips which way the *same* popup opens ("up" from the composer, "down"
// from the top bar) — the trigger, list, and animation are otherwise identical.
export function ModelSelector({ placement = "up" }: { placement?: "up" | "down" }) {
  const { models, activeModel, activeSubModel, selectModel } = useApp();
  const { open, toggle, close, ref } = useDropdown();
  const rowVariants = usePopupRowVariants();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <span className={cn("size-1.5 rounded-full", DOT[activeModel.availability])} />
        {activeModel.name}
        <span className="text-[var(--text-muted)]">· {activeSubModel}</span>
        <ChevronDown className="size-3.5" />
      </button>

      {open && (
        <motion.ul
          role="listbox"
          variants={popupListVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            "absolute left-0 z-30 w-72 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1 shadow-xl",
            placement === "down" ? "top-full mt-2" : "bottom-full mb-2",
          )}
        >
          {models.map((model) => (
            <ModelRow
              key={model.id}
              model={model}
              active={model.id === activeModel.id}
              variants={rowVariants}
              onSelect={() => {
                selectModel(model.id);
                close();
              }}
            />
          ))}
        </motion.ul>
      )}
    </div>
  );
}

function ModelRow({
  model,
  active,
  variants,
  onSelect,
}: {
  model: Model;
  active: boolean;
  variants: Variants;
  onSelect: () => void;
}) {
  return (
    <motion.li variants={variants} style={{ willChange: "transform, opacity" }}>
      <button
        type="button"
        role="option"
        aria-selected={active}
        onClick={onSelect}
        className={cn(
          "w-full rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
          active && "bg-[var(--bg-hover)]",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-primary)]">
            <span className={cn("size-1.5 rounded-full", DOT[model.availability])} />
            {model.name}
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">{model.provider}</span>
        </div>
        <p className="mt-0.5 pl-3.5 text-[12px] text-[var(--text-secondary)]">{model.description}</p>
        <div className="mt-1 flex flex-wrap gap-1 pl-3.5">
          {model.capabilities.map((cap) => (
            <span key={cap} className="rounded bg-[var(--bg-hover)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]">
              {cap}
            </span>
          ))}
          <span className="rounded bg-[var(--bg-hover)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]">
            {Math.round(model.contextWindow / 1000)}k
          </span>
          <span className="rounded bg-[var(--bg-hover)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]">
            ${model.priceMtok}/Mtok
          </span>
        </div>
      </button>
    </motion.li>
  );
}
