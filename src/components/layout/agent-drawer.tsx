"use client";

import { useEffect, useState } from "react";
import { Check, Search } from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { Drawer } from "@/components/ui/drawer";
import type { Agent } from "@/types/agent.types";
import { getModel } from "@/lib/mock/models";
import { cn } from "@/lib/utils";

// Mobile-first agent-management drawer. Slides in full-width on phones; lists
// agents as responsive cards, switches the active agent on tap, and scrolls
// independently of the chat behind it. Body is mounted only while open so the
// loading state restarts on each visit.
export function AgentDrawer() {
  const { agents, activeAgent, selectAgent, agentDrawerOpen, setAgentDrawerOpen } = useApp();
  const close = () => setAgentDrawerOpen(false);

  return (
    <Drawer
      open={agentDrawerOpen}
      onClose={close}
      title="Agents"
      description="Browse the available agents and switch the one handling this thread."
    >
      {agentDrawerOpen && (
        <AgentDrawerBody
          agents={agents}
          activeAgentId={activeAgent.id}
          onSelect={(id) => {
            selectAgent(id);
            close();
          }}
        />
      )}
    </Drawer>
  );
}

function AgentDrawerBody({
  agents,
  activeAgentId,
  onSelect,
}: {
  agents: Agent[];
  activeAgentId: string;
  onSelect: (id: string) => void;
}) {
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");

  // Simulated fetch so the loading state is exercised — replace with a real
  // request when agents come from a backend. No sync setState in the effect
  // (the body remounts fresh per open, so `ready` starts false).
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(timer);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? agents.filter((a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q))
    : agents;

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2 rounded-lg bg-[var(--bg-hover)] px-2.5 py-2">
        <Search className="size-4 text-[var(--text-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search agents"
          aria-label="Search agents"
          className="w-full bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
        />
      </div>

      {!ready ? (
        <AgentListSkeleton />
      ) : filtered.length === 0 ? (
        <p role="status" className="px-1 py-8 text-center text-[13px] text-[var(--text-secondary)]">
          No agents match “{query}”.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((agent) => (
            <li key={agent.id}>
              <AgentCard agent={agent} active={agent.id === activeAgentId} onSelect={() => onSelect(agent.id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AgentCard({
  agent,
  active,
  onSelect,
}: {
  agent: Agent;
  active: boolean;
  onSelect: () => void;
}) {
  const defaultModel = getModel(agent.defaultModel);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
        active
          ? "border-[var(--accent)] bg-[var(--bg-hover)]"
          : "border-[var(--border)] hover:bg-[var(--bg-hover)]",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white"
          style={{ backgroundColor: agent.color }}
          aria-hidden
        >
          {agent.avatar}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 text-[14px] font-medium text-[var(--text-primary)]">
            {agent.name}
            {active && <Check className="size-3.5 text-[var(--accent)]" />}
          </span>
          <span className="block truncate text-[12px] text-[var(--text-secondary)]">{agent.description}</span>
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {agent.tools.map((tool) => (
          <span
            key={tool}
            className="rounded bg-[var(--bg-primary)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]"
          >
            {tool}
          </span>
        ))}
        <span className="ml-auto text-[10px] text-[var(--text-muted)]">Default · {defaultModel.name}</span>
      </div>
    </button>
  );
}

function AgentListSkeleton() {
  return (
    <ul className="flex flex-col gap-2" aria-hidden>
      {[0, 1, 2].map((i) => (
        <li key={i} className="animate-pulse rounded-xl border border-[var(--border)] p-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-[var(--bg-hover)]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 rounded bg-[var(--bg-hover)]" />
              <div className="h-2.5 w-2/3 rounded bg-[var(--bg-hover)]" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
