"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import type { Agent } from "@/types/agent.types";
import { cn } from "@/lib/utils";

// The single source of truth for the "Specialist" popup — its list box, its
// rows, and its entrance animation. Both the composer's agent selector and the
// top bar's Specialist hover popup render this, so the two can never drift.
//
// Spring-like organic entrance: rows rise from below, fade + scale in, and
// stagger so they cascade rather than snapping in as a block. The overshoot
// easing (cubic-bezier 0.34,1.56,0.64,1) gives a soft bounce; it plays once on
// mount and is flattened entirely under prefers-reduced-motion. The model
// selector reuses these exact variants so it opens identically.
const SPRING = [0.34, 1.56, 0.64, 1] as const;

export const popupListVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: SPRING },
  },
};

const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

// Reduced-motion-aware row variants — shared so every popup that copies the
// Specialist list (model selector included) honours the same accessibility rule.
export function usePopupRowVariants(): Variants {
  const reduceMotion = useReducedMotion();
  return reduceMotion ? staticVariants : rowVariants;
}

// The Specialist popup body: the staggered agent list. `className` carries the
// caller's positioning (the composer anchors it above its trigger; the top bar
// anchors it below), while the box style stays identical everywhere.
export function AgentList({
  agents,
  activeAgentId,
  onSelect,
  className,
}: {
  agents: Agent[];
  activeAgentId: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const variants = usePopupRowVariants();

  return (
    <motion.ul
      role="listbox"
      variants={popupListVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "w-72 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1 shadow-xl",
        className,
      )}
    >
      {agents.map((agent) => (
        <AgentRow
          key={agent.id}
          agent={agent}
          active={agent.id === activeAgentId}
          variants={variants}
          onSelect={() => onSelect(agent.id)}
        />
      ))}
    </motion.ul>
  );
}

function AgentRow({
  agent,
  active,
  variants,
  onSelect,
}: {
  agent: Agent;
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
        <div className="flex items-center gap-2">
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
            style={{ backgroundColor: agent.color }}
            aria-hidden
          >
            {agent.avatar}
          </span>
          <span className="flex-1 text-[13px] font-medium text-[var(--text-primary)]">{agent.name}</span>
          {active && <Check className="size-3.5 text-[var(--accent)]" />}
        </div>
        <p className="mt-0.5 pl-8 text-[12px] text-[var(--text-secondary)]">{agent.description}</p>
        <div className="mt-1 flex flex-wrap gap-1 pl-8">
          {agent.tools.map((tool) => (
            <span key={tool} className="rounded bg-[var(--bg-hover)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]">
              {tool}
            </span>
          ))}
        </div>
      </button>
    </motion.li>
  );
}
