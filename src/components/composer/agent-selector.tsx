"use client";

import { ChevronDown } from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { useDropdown } from "@/hooks/use-dropdown";
import { AgentList } from "@/components/agent-list";

// Agent chip + dropdown — the canonical "Specialist" popup. The list, rows, and
// staggered spring entrance live in the shared AgentList so the top bar's
// Specialist hover popup renders exactly the same thing. Selecting an agent also
// switches to its default model (handled in the store), updating the composer
// placeholder + chips.
export function AgentSelector() {
  const { agents, activeAgent, selectAgent } = useApp();
  const { open, toggle, close, ref } = useDropdown();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <span
          className="flex size-4 items-center justify-center rounded-full text-[9px] font-semibold text-white"
          style={{ backgroundColor: activeAgent.color }}
          aria-hidden
        >
          {activeAgent.avatar}
        </span>
        {activeAgent.name}
        <ChevronDown className="size-3.5" />
      </button>

      {open && (
        <AgentList
          agents={agents}
          activeAgentId={activeAgent.id}
          onSelect={(id) => {
            selectAgent(id);
            close();
          }}
          className="absolute bottom-full left-0 z-30 mb-2"
        />
      )}
    </div>
  );
}
