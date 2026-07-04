# Agent Workspace

A single-page, enterprise-style AI agent console: threads with pinned/recent
history and search, live-streaming reasoning traces, simulated tool
execution (Web Search, Code Interpreter, Document Reader), model and agent
switching, an inspector panel with per-turn metrics, and pause/resume/stop/
retry controls on every in-flight response. Everything is simulated
client-side — there is no backend, and no fixed canned Q&A. Type anything;
the response is synthesized live from what you actually typed.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion (animation)
- Lucide React (icons)
- react-markdown + remark-gfm (message rendering: tables, code blocks, links)
- Bun (runtime, package manager, bundler)

## Run it

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000). Pick an agent and
model from the composer, type any request, and watch it think, run tools,
and stream an answer. Try messages containing words like "search", "bug", or
"file" to trigger different simulated tool calls.

## Structure

```
src/app/                          the single route
src/components/workspace/         Sidebar, Topbar, StatusBar, Inspector, and
                                   the top-level AgentWorkspace that wires
                                   everything together
src/components/thread/            message list, message bubble, markdown
                                   renderer, reasoning block, tool card
src/components/composer/          the message composer (auto-resize,
                                   attachments, selectors, send/stop)
src/components/selectors/         Model Selector, Agent Selector dropdowns
src/lib/ecosystem/types.ts        Agent, Model, Thread, Message, ToolCall,
                                   ReasoningStep — the whole data model
src/lib/ecosystem/data.ts         seed agents, models, starter threads
src/lib/ecosystem/mock-responder.ts   synthesizes a reasoning/tool/output
                                       turn from real user input
src/lib/ecosystem/use-agent-simulation.ts   the state machine driving
                                             thinking → tools → streaming
src/lib/use-dropdown.ts           shared open/close/outside-click hook
docs/                             operational docs — see below
```

## Scope note

This covers the "extended core" of a larger enterprise-agent-UI brief: one
workspace layout, one chat thread with reasoning/tools/citations, one
composer, and the model/agent selectors. Deliberately out of scope for now:
workflow builder, memory explorer, analytics/dashboard pages, command
palette, artifact viewers (canvas/spreadsheet/diff), settings, and
approval/task-queue pages. See `docs/handoff.md` for the reasoning.

## Documentation

- [AGENTS.md](AGENTS.md) — development rules and mandatory workflow (read this first)
- [docs/session.md](docs/session.md) — operational changelog
- [docs/handoff.md](docs/handoff.md) — current project state and context
