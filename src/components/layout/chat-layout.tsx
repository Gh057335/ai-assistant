"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PanelLeft, Users } from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { Sidebar } from "./sidebar";
import { TopProviderBar } from "./top-provider-bar";
import { AgentDrawer } from "./agent-drawer";
import { Conversation } from "@/components/chat/conversation";
import { Composer } from "@/components/composer/composer";
import { ModelSelector } from "@/components/composer/model-selector";

// Shell: fixed desktop sidebar + animated mobile drawer, a header whose hover
// zone reveals the provider bar, then the scrollable conversation and the
// pinned composer. No right panel — everything is on-demand (per spec).
export function ChatLayout() {
  const { activeThread, activeAgent, sidebarOpen, setSidebarOpen, setAgentDrawerOpen } = useApp();

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {/* Persistent topbar model switcher — the sole model chooser on desktop. */}
        <div className="hidden md:block">
          <TopProviderBar />
        </div>

        <header className="border-b border-[var(--border)] px-3 py-3 md:px-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="rounded-md p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] md:hidden"
            >
              <PanelLeft className="size-4" />
            </button>
            <h1 className="truncate text-sm font-medium text-[var(--text-primary)]">
              {activeThread.messages.length === 0 ? "New Chat" : activeThread.title}
            </h1>

            {/* Agent-management trigger — mobile only (desktop uses the composer
                agent selector). The bottom edge is owned by the composer, so the
                app-bar action is the native-appropriate trigger here. */}
            <button
              type="button"
              onClick={() => setAgentDrawerOpen(true)}
              aria-label="Manage agents"
              aria-haspopup="dialog"
              className="ml-auto flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:hidden"
            >
              <span
                className="flex size-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                style={{ backgroundColor: activeAgent.color }}
                aria-hidden
              >
                {activeAgent.avatar}
              </span>
              <Users className="size-4" />
            </button>
          </div>

          {/* Model selector — mobile only. On desktop it lives in the composer;
              below md the composer hides it and it relocates here, under the
              "New Chat" title. Same ModelSelector component/popup, opened
              downward. The Specialist (AgentSelector) stays in the composer. */}
          <div className="mt-2 md:hidden">
            <ModelSelector placement="down" />
          </div>
        </header>

        <Conversation />
        <Composer />
      </div>

      <AgentDrawer />
    </div>
  );
}
