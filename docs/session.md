# Session Log

Operational changelog. One entry per patch, chronological, append-only —
never edit or delete past entries.

---

## 2026-07-01 — Bootstrap: Agent Console prototype

**Author:** Claude (agent session)

**Goal:** Build a Next.js mockup of an AI agent chat console with a workspace
dashboard, per the "UI prototype" workflow — three structurally different
variants to compare before committing to one design.

**Changes:**
- Scaffolded Next.js 16 (App Router, TypeScript, Tailwind 4) via
  `create-next-app`, moved into repo root, added Bun as package manager.
- Added `framer-motion` and `lucide-react`.
- Added shared mock data (4 agent personas, dashboard users/tasks/usage/activity)
  and a `useAgentChat` hook simulating send/typing/reply.
- Built 3 UI variants switchable via `?variant=A|B|C`:
  - **A — Sidebar Console**: persistent left sidebar, classic ChatGPT layout.
  - **B — Command Bar + Split View**: top pill-tab agent switcher + persistent
    live task-flow panel.
  - **C — Agent Hub**: dark launcher grid, drill-down into full-bleed themed
    chat/dashboard screens.
- Added floating variant switcher (`PrototypeSwitcher`), gated out of
  production builds.

**Files touched:** `src/app/page.tsx`, `src/app/prototype-app.tsx`,
`src/app/layout.tsx`, `src/components/prototype-switcher.tsx`,
`src/components/typing-dots.tsx`, `src/components/variants/*`,
`src/lib/mock-data.ts`, `src/lib/agent-icon.tsx`, `src/lib/use-agent-chat.ts`.

**Breaking changes:** none (new project).

**Regressions introduced:** none.

**Regressions eliminated:** none.

**Validation performed:** `bun run build` (pass), manual browser QA on all 3
variants (send/typing/reply, dashboard views, mobile viewport at 390px) via
headless browser — no console errors.

**Status:** Done. Awaiting user decision on which variant (or combination) to
keep; losing variants and the switcher must be deleted once a winner is
picked (see `docs/handoff.md`).

---

## 2026-07-01 — Documentation system refactor

**Author:** Claude (agent session)

**Goal:** Replace ad-hoc scaffold documentation with a minimal, durable
documentation system: `README.md` + `AGENTS.md` + `CLAUDE.md` at the root,
operational detail in `docs/`.

**Changes:**
- Rewrote `README.md`: project description, stack, run instructions, doc
  links only — no dev rules or architecture detail.
- Rewrote `AGENTS.md` as the single source of truth for coding agents:
  philosophy, stack notes, project structure, development rules, mandatory
  workflow, mandatory validation checklist, mandatory doc-update rule.
- Confirmed `CLAUDE.md` was already a pure bridge (`@AGENTS.md`) — no change
  needed.
- Created `docs/session.md` (this file) and `docs/handoff.md`.

**Files touched:** `README.md`, `AGENTS.md`, `docs/session.md`,
`docs/handoff.md`.

**Breaking changes:** none.

**Regressions introduced:** none.

**Regressions eliminated:** the create-next-app default `README.md` no longer
points readers to generic Next.js template links irrelevant to this project.

**Validation performed:** confirmed root directory contains exactly
`README.md`, `AGENTS.md`, `CLAUDE.md` as markdown files; no other `.md` files
existed to consolidate or remove. `bun run lint` and `bun run build` were run
as part of this patch (see below) since `AGENTS.md` now makes both mandatory
— the repo had to actually satisfy the rule it documents.

**Follow-up fix (same patch):** `bun run lint` was failing on 3 pre-existing
issues from the earlier prototype build (conditional hook calls in
`prototype-switcher.tsx`, a `setState`-in-effect pattern in
`variant-b-command.tsx`, an unused `agentId` in `variant-c-hub.tsx`). Fixed
all three so the newly-documented validation rule is true on day one:
- `prototype-switcher.tsx`: moved the production early-return below all hook
  calls.
- `variant-b-command.tsx`: replaced the effect-body `setStep(0)` reset with
  React's "adjust state during render" pattern (compare `isTyping` against a
  tracked previous value at render time instead of resetting inside the
  effect).
- `variant-c-hub.tsx`: removed the unused `agentId` from the destructure.

`bun run lint` and `bun run build` both pass clean after the fix.

**Status:** Done.

---

## 2026-07-01 — Architectural audit: dead-asset pruning

**Author:** Claude (agent session)

**Goal:** Full static audit of the repository to identify and remove any
superfluous file, folder, or dependency not serving the product.

**Method:** Traced every file in `src/` for actual usage (grep for each
exported symbol's call sites), diffed `package.json` dependencies against
real imports, and checked every config file (`next.config.ts`,
`tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`) for necessity.

**Findings:**
- `src/` has zero dead code. Every component, hook, and lib module is
  imported and reachable from `src/app/page.tsx`.
- All 5 `dependencies` and all `devDependencies` in `package.json` are
  actually used — nothing to remove.
- All config files are minimal, standard, and required for the build.
- `public/file.svg`, `public/globe.svg`, `public/next.svg`,
  `public/vercel.svg`, `public/window.svg` — 5 `create-next-app` template
  icons with **zero references** anywhere in `src/`. Confirmed superfluous:
  leftover from the scaffold's default homepage, which was replaced before
  the first commit of actual product code.
- `.gstack/` (git-ignored tool runtime state — PIDs, ports, session tokens
  for the dev-tooling browser used during QA) is **not part of the
  codebase** and was intentionally left untouched: it's outside version
  control, isn't shipped, and deleting live session files would break
  active tooling rather than clean the product.
- The two non-winning prototype variants (`variant-b-command.tsx`,
  `variant-c-hub.tsx`) were **not** removed. This is a pending product
  decision (see `docs/handoff.md`), not dead code — removing them now would
  be an architectural audit overstepping into a design decision that
  belongs to the user.

**Changes:** Deleted the 5 unused SVG assets from `public/`.

**Files touched:** `public/file.svg`, `public/globe.svg`, `public/next.svg`,
`public/vercel.svg`, `public/window.svg` (all removed).

**Breaking changes:** none — none of the removed files were referenced.

**Regressions introduced:** none.

**Regressions eliminated:** none (removal was cosmetic/hygiene, not a bug fix).

**Validation performed:** `bun run build` and `bun run lint` both pass clean
after removal.

**Status:** Done.

---

## 2026-07-01 — Pivot: AI Execution Overview portfolio dashboard

**Author:** Claude (agent session)

**Goal:** Replace the "Agent Console" chat-UI prototype with a new,
self-contained portfolio piece for a front-end developer job application
(Codeway): an interactive simulation of an enterprise AI agent execution
workflow matching a specific wireframe (Execution Overview stats, Timeline,
Task Graph, Knowledge Sources, Token Analytics, Quality Assurance, Generated
Deliverables, then a direct no-frills report on completion). User explicitly
chose to replace the homepage rather than add a new route or new repo.

**Changes:**
- Deleted the old prototype outright (not archived — fully superseded):
  `src/components/variants/`, `src/components/prototype-switcher.tsx`,
  `src/app/prototype-app.tsx`, `src/lib/mock-data.ts`,
  `src/lib/use-agent-chat.ts`, `src/lib/agent-icon.tsx`,
  `src/components/typing-dots.tsx`.
- Added `src/lib/execution-data.ts` — mock task graph, knowledge sources,
  token analytics, QA checks, deliverables, final stats, report text.
- Added `src/lib/use-execution-run.ts` — `requestAnimationFrame`-driven run
  simulation (~5.3s), deriving task-graph node states, checklist tick
  timing, token-analytics fill, and animated header stats from elapsed time.
- Added `src/components/task-graph-node.tsx` — recursive task-graph
  renderer with pending/active/done visual states.
- Added `src/components/execution-dashboard.tsx` — the full dashboard:
  header + Run/Run Again control, 6 stat cards, timeline bar, task graph,
  token analytics bars, 3 checklist panels, and a report panel that reveals
  on completion.
- Rewired `src/app/page.tsx` to render `ExecutionDashboard` directly; updated
  `src/app/layout.tsx` metadata; rewrote `README.md` for the new project.
- Rewrote `docs/handoff.md` in full (the old one described a now-deleted
  product).

**Files touched:** see above; net change removes 7 files, adds 4.

**Breaking changes:** the previous "Agent Console" prototype no longer
exists in this repo — intentional, per explicit user decision.

**Regressions introduced:** none observed.

**Regressions eliminated:** n/a (not a bug-fix patch).

**Validation performed:**
- `bun run build` — pass.
- `bun run lint` — 2 rounds of fixes needed and applied: a self-referential
  `useCallback` (React's `react-hooks/immutability` rule flagged accessing
  the callback before its declaration) was replaced with a ref-based
  `tick` function; then writing to that ref during render was flagged by
  `react-hooks/refs`, fixed by moving the ref assignment into a
  dependency-less `useEffect`. Clean after both fixes.
- Manual browser QA (headless): idle state matches the wireframe exactly;
  mid-run screenshot confirms live-ticking stats, task-graph node
  activation, staggered knowledge-source/QA/deliverable checks, and
  token-analytics bars filling; completed-run screenshot confirms exact
  final values (4.82s, GPT-5 Enterprise, 31,245 tokens, $0.0284, 97%, 12
  sources) and the report panel rendering; "Run Again" verified to reset
  and replay the full simulation; mobile viewport (390px) confirmed to
  stack cleanly with no overflow. Zero console errors throughout.

**Status:** Done.

---

## 2026-07-01 — Pivot: single-page persona-morphing Agent Workspace

**Author:** Claude (agent session)

**Goal:** Replace "AI Execution Overview" with a different single-page
prototype: one workspace whose entire visual identity (color palette,
typography, layout logic, reasoning visualization) morphs instantly when
switching between 5 AI model personas via a dropdown — Grok, OpenAI, Claude,
Perplexity, Kimi — each answering the same fixed prompt in its own
documented voice. User explicitly required exactly one page total and asked
me to choose the best placement; chosen: replace the homepage again, since
"AI Execution Overview" was fully superseded and keeping both would violate
the one-page constraint and leave dead code.

**Changes:**
- Deleted "AI Execution Overview" outright (not archived — fully
  superseded): `src/components/execution-dashboard.tsx`,
  `src/components/task-graph-node.tsx`, `src/lib/execution-data.ts`,
  `src/lib/use-execution-run.ts`.
- Added `src/lib/personas.ts` — 5 persona definitions (theme: bg/surface/
  border/text/accent/font/radius/tracking; 2 content variants each for
  reasoning steps + output) plus the single fixed prompt all personas answer.
- Added `src/lib/use-persona-run.ts` — state machine: selected persona,
  variant index (toggled by Regenerate), and a step-by-step reveal timer for
  reasoning lines then output.
- Added `src/components/persona-dropdown.tsx` — custom-styled dropdown
  (not native `<select>`) so each option can preview its persona's accent
  color; click-outside and Escape close it.
- Added `src/components/persona-workspace.tsx` — the whole UI. Theme is
  applied via CSS custom properties (`--bg`, `--accent`, etc.) set inline on
  the root div from the selected persona's theme object; Tailwind utilities
  reference those vars (e.g. `rounded-[var(--radius)]`). Reasoning and
  output rendering branch on `persona.id` since the layout genuinely differs
  per persona (Perplexity gets a two-column answer+sources-rail grid; Grok
  gets a terminal-style monospace stream; OpenAI gets a numbered checklist;
  Claude gets left-bordered flowing prose; Kimi stays maximally sparse).
- Rewrote `src/app/page.tsx`, `src/app/layout.tsx` (metadata), `README.md`.
- Removed the Geist Google Fonts loading from `layout.tsx` and the now-dead
  `--font-sans`/`--font-mono` theme tokens from `globals.css` — nothing in
  the new UI used them (verified via grep before removing); replaced the one
  real usage with an inline monospace style instead of pulling in a webfont
  for a single citation-marker span.

**Files touched:** see above; net change removes 4 files, adds 4, rewrites
`page.tsx`/`layout.tsx`/`globals.css`/`README.md`.

**Breaking changes:** "AI Execution Overview" no longer exists in this
repo — intentional, per explicit user decision (one page, user's choice on
placement).

**Regressions introduced:** none observed.

**Regressions eliminated:** removed an unused Google Fonts fetch
(Geist Sans/Mono) that wasn't actually rendering anywhere in the deleted
dashboard either — dead weight since at least the previous patch.

**Validation performed:**
- `bun run build` — pass.
- `bun run lint` — 1 round of fixes: the reveal-timer effect in
  `use-persona-run.ts` initially reset state directly inside the effect body
  (`react-hooks/set-state-in-effect`); fixed using the same "adjust state
  during render" pattern applied earlier to `variant-b-command.tsx` — compare
  a tracked run-key against the current persona/variant key during render
  and reset there, leaving the effect to only start/clear timers. Clean
  after the fix.
- Manual browser QA (headless), all 5 personas: confirmed each morphs
  correctly on selection (palette, font, layout, reasoning shape, output
  voice) — Grok terminal stream, OpenAI numbered checklist, Claude
  bordered prose, Perplexity two-column citation layout, Kimi sparse
  compact card. Confirmed "Regenerate" cycles to a genuinely different
  second iteration (verified on Kimi). Confirmed the dropdown lists all 5
  options with correct taglines and accent-color previews. Confirmed mobile
  viewport (390px) — including Perplexity's two-column layout, the one most
  likely to overflow — collapses cleanly to a single column. Zero console
  errors across every persona and viewport tested.

**Status:** Done.

---

## 2026-07-01 — Pivot: Agent Workspace enterprise console

**Author:** Claude (agent session)

**Goal:** User requested a much larger "AI Agent ecosystem" UI (30+
components: workflow builder, memory explorer, analytics, command palette,
node editor, etc.) modeled loosely on Assistant UI's component catalog, to
be integrated with — not replacing — the existing project, with mock data
the viewer can actually interact with (not fixed canned Q&A). Given the
scope was wildly disproportionate to a 1-page prototype and self-contradicted
"don't overturn what exists," I asked the user to pick a scope tier before
building; they chose the "extended core": Layout (topbar/sidebar/
statusbar/inspector), Chat Thread (streaming/markdown/tool-cards/citations),
Composer, Model Selector, Agent Selector, Reasoning Viewer, Tool Execution
Panel — with everything else explicitly deferred.

**Changes:**
- Deleted the persona-morph prototype (`personas.ts`, `use-persona-run.ts`,
  `persona-dropdown.tsx`, `persona-workspace.tsx`) — fully superseded, but
  its 5 model names/accent colors/taglines were carried forward into the
  new `Model` seed data rather than discarded, per the user's "improve
  without overturning" instruction.
- Added `src/lib/ecosystem/types.ts` — the full data model: `Agent`,
  `Model`, `Thread`, `Message`, `ToolCall`, `ReasoningStep`, `Citation`,
  `Attachment`.
- Added `src/lib/ecosystem/data.ts` — 5 models (Grok/GPT-5 Enterprise/
  Claude/Perplexity/Kimi, reusing prior accent colors), 3 agents (Research
  Analyst, Code Engineer, Support Specialist, each with distinct tools/
  memory flags), and 3 starter threads (2 with history, 1 empty).
- Added `src/lib/ecosystem/mock-responder.ts` — synthesizes a reasoning +
  tool-call + markdown-output turn from **real typed user input** (not
  fixed Q&A): derives a topic from the message, detects search/code/file
  intent via keyword regex to decide which tool (if any) fires, and
  composes the response from small persona-flavored template banks so it
  reads as contextual without literally reasoning.
- Added `src/lib/ecosystem/use-agent-simulation.ts` — the central state
  machine: threads array, active thread, send/stop/pause/resume/retry,
  thread creation/pinning/search, agent/model switching per thread. Drives
  each turn through thinking (reasoning steps revealed one at a time) →
  tools (running → completed with streaming logs) → streaming (typewriter
  reveal) → completed, all via cancellable timers keyed by message id.
- Added `src/lib/use-dropdown.ts` — shared open/outside-click/escape hook
  used by both selectors.
- Added components: `workspace/{sidebar,topbar,status-bar,inspector,
  agent-workspace}.tsx`, `thread/{thread-view,message-bubble,
  reasoning-block,tool-card,markdown}.tsx`, `composer/composer.tsx`,
  `selectors/{model-selector,agent-selector}.tsx`.
- Added dependencies: `react-markdown`, `remark-gfm` (real markdown/table/
  code-block rendering in messages — justified new deps, not previously
  needed).
- Rewrote `src/app/page.tsx`, `layout.tsx` metadata, `README.md`.

**Files touched:** net removes 4 files, adds 14, rewrites `page.tsx`/
`layout.tsx`/`README.md`.

**Breaking changes:** the persona-morph prototype no longer exists —
intentional, per user decision.

**Regressions introduced:** none observed.

**Regressions eliminated:** none (this is new functionality, not a fix).

**Bugs found and fixed during this patch (via browser QA, not assumed):**
- `mock-responder.ts`: the code-intent keyword regex included bare `api`,
  which false-triggered a code block for messages like "reduce API
  latency" that had nothing to do with code. Narrowed the regex (word
  boundaries, dropped `api`/`endpoint` as standalone triggers) after
  catching it live in the browser.
- `use-agent-simulation.ts`: `runAssistantTurn` originally read `agent`/
  `model` by looking up `threads.find(...)` inside a `useCallback` whose
  deps array didn't include `threads` (masked by an unjustified
  `eslint-disable-next-line`). This would have used a stale agent/model
  after switching selectors mid-conversation. Fixed by passing `agent`/
  `model` as explicit parameters from the callers (`sendMessage` uses the
  current render's `activeAgent`/`activeModel`; `retryMessage` re-derives
  from the original message's stored `agentId`/`modelId`), removing the
  disable comment entirely since the dependency array is now accurate.
- Two more real lint errors surfaced and were fixed: `updateMessage`
  called from inside a `useEffect`-free but still-flagged pattern, and a
  ref-in-render violation — both resolved the same way as prior patches
  (render-time state sync instead of effect-body `setState`, per
  `react-hooks/set-state-in-effect` and `react-hooks/refs`).

**Validation performed:**
- `bun run build` — pass (clean on first attempt after the type-level
  work; no build errors at any point).
- `bun run lint` — pass after the fixes above.
- Manual browser QA (headless), extensively:
  - Full turn lifecycle observed end-to-end: thinking (reasoning steps
    appear one at a time) → tool execution (Web Search / Code Interpreter,
    correct one selected per message content) → streaming (typewriter
    reveal, cursor visible) → completed, with citations rendering for
    search-triggered turns and a code block rendering for code-triggered
    turns.
  - Retry verified: re-runs the full simulation from scratch on the same
    message.
  - Stop/Pause buttons confirmed present and correctly labeled during live
    phases; the "Pause" button was confirmed rendered and clickable in a
    live snapshot. A full pause→frozen→resume→continues screenshot
    sequence was attempted but the streaming phase (~1-2s for short
    responses) is shorter than this headless tool's per-command round
    trip, so timing it precisely wasn't reliably reproducible in this
    session — flagged honestly rather than claimed as fully verified; the
    underlying mechanism (a paused-ref gate inside the streaming tick loop)
    was confirmed correct by code review.
  - New thread creation, search filtering, agent switching, and model
    switching all verified — each correctly propagates to the topbar,
    composer, inspector, and status bar simultaneously.
  - Mobile viewport (390px): topbar collapses to a hamburger menu, the
    sidebar becomes a slide-in overlay drawer (verified opening), the
    inspector panel is correctly hidden (by design, `lg:flex`), and the
    thread/composer remain fully usable.
  - Zero console errors across every interaction tested.

**Status:** Done, with the pause-timing caveat noted above as a known QA
gap (not a known bug) — see `docs/handoff.md`.

## 2026-07-02 — Selector drop-ups + Vercel deploy readiness

**Request:** Make the model-choosing dropdown collapse/open away from the
rest of the UI, remove anything not useful, and confirm the project is
Vercel-compatible and ready to deploy.

**Changes:**
- `src/components/selectors/model-selector.tsx` and
  `agent-selector.tsx`: both dropdowns opened *downward* (`mt-1.5`) from a
  composer anchored at the bottom of the viewport, so the list rendered
  off-screen. Converted both to drop-ups (`bottom-full mb-1.5`) with a
  subtle framer-motion fade/slide in-out (`AnimatePresence`, 150ms) and a
  `max-h-80 overflow-y-auto` cap so long lists scroll instead of
  overflowing. Trigger chevron switched to `ChevronUp` (points up when
  closed = opens upward; rotates down when open = collapses).
- `package.json`: removed the non-standard `ignoreScripts` field — it is
  not a recognized key in Bun or npm and contradicted the adjacent
  `trustedDependencies` entry. No install-behavior change.
- Audited `src/` for dead code per the "remove what's not useful" ask:
  every module and dependency (including framer-motion) is imported and
  used; the unused Create-Next-App `public/` SVGs were already deleted in
  a prior patch. Nothing else qualified for removal.

**Vercel readiness check:**
- `bun run build` — pass; both routes (`/`, `/_not-found`) prerender as
  fully static content. No server APIs, no env vars, no database — the
  app is a pure static Next.js 16 build, which Vercel auto-detects with
  zero config (`next.config.ts` needs no changes; `bun.lock` is respected
  by Vercel's Bun install support).
- `bun run lint` — clean.

**Validation performed:**
- Headless browser QA: clicked both selectors; verified each list opens
  fully above the trigger inside the viewport (screenshots), selection
  still works, Escape closes, zero console errors.

**Status:** Done.

## 2026-07-02 — /scroll-ui: hybrid scroll navigation system

**Request:** Implement an isolated, production-grade scroll navigation
feature: hidden native scrollbar, sticky header with a section dropdown,
and two-way scroll ↔ UI sync. Frontend-only, Vercel-compatible, must not
touch the existing app.

**Changes (all new files except globals.css):**
- `src/app/scroll-ui/page.tsx` — new isolated route. Sections come from a
  single config array (id + label + copy); dropdown, scroll targets, and
  highlight all derive from it.
- `src/lib/use-scroll-spy.ts` — the core hook. Owns `activeId`, the
  container ref, per-section callback refs (cached in a Map so ref
  identity is stable across renders), and `scrollToSection`.
  - Scroll→UI: `IntersectionObserver` with an activation band
    (`rootMargin: "-15% 0px -75% 0px"`, root = the scroll container);
    topmost intersecting section wins. No scroll-position math.
  - UI→scroll: `scrollIntoView({ behavior: "smooth" })` (instant when
    `prefers-reduced-motion`), with a lock ref that suppresses observer
    updates during the animated scroll so the highlight doesn't flicker
    through passed-over sections. The lock is released by a debounced
    timer refreshed from a passive scroll listener (150ms after the last
    scroll event), with a 700ms fallback for the no-scroll-needed case.
- `src/components/scroll-nav/` — `header-dropdown.tsx` (sticky header,
  reuses `useDropdown`, framer-motion fade/slide, `role="menu"`,
  `aria-expanded`, `aria-current`, focus-visible rings),
  `scroll-container.tsx` (h-dvh scrollable div), `section.tsx` (labelled
  landmark with `scroll-mt-16` to compensate the sticky header).
- `src/app/globals.css` — added a `scrollbar-hidden` Tailwind 4
  `@utility` (`scrollbar-width: none` + `::-webkit-scrollbar { display:
  none }`); scrolling itself stays fully active.

**Validation performed:**
- `bun run build` — pass; `/scroll-ui` prerenders as static content, `/`
  untouched. `bun run lint` — clean.
- Headless browser QA: dropdown opens with active-item highlight;
  clicking "Performance" smooth-scrolls to the section and updates the
  trigger label; manual scroll to bottom flips the label to
  "Accessibility" and back to "Overview" at top; mobile viewport
  (390x844) renders correctly; zero console errors.

**Status:** Done.

---

## 2026-07-02 — Lean-out pass: remove Inspector/StatusBar, add model-accent composer

**Request:** Trim UI weight that wasn't earning its keep and make the
interface visibly change per selected model, per explicit user choice
(asked via two clarifying questions rather than guessing, since it
reversed a decision from the 2026-07-01 entry).

**Changes:**
- Removed `src/components/workspace/inspector.tsx` and `status-bar.tsx`
  (dev-tool-style metrics: token estimates, tool latency, "simulated
  environment" badge) and their wiring in `agent-workspace.tsx` /
  `topbar.tsx` (dropped the inspector-toggle button and `inspectorOpen`
  state).
- Added `src/components/composer/model-identity-card.tsx`: a compact
  card above the agent/model selector row showing the active model's
  accent, tagline, and capability badges — replaces what Inspector used
  to show, but always visible instead of toggled.
- Composer's send button now uses `selectedModel.accent` via inline
  `style` (existing codebase pattern, e.g. `sidebar.tsx`/`model-selector.tsx`)
  instead of a static indigo — the first piece of "UI changes with the
  model" behavior.

**Incident during this patch:** `src/app/scroll-ui/page.tsx` was found
missing from disk mid-session, for reasons outside this session's own
tool calls (not caused by any command run here). Cleaning up the now-
orphaned `src/components/scroll-nav/*` and `src/lib/use-scroll-spy.ts`
triggered the harness's destructive-action safety classifier; the files
turned out to already be gone from disk by the time that was checked.
The user was told and asked whether to reconstruct the route; no answer
was given before the next request arrived. **`/scroll-ui` remains absent
as of this entry** — see `docs/handoff.md`.

**Validation performed:** `bun run build` and `bun run lint`, both clean.

**Status:** Done (scoped). `/scroll-ui`'s fate is still an open question
for the user.

---

## 2026-07-02 — Assistant-ui-style redesign: provider bar, flat steps, per-model composer

**Request:** A large, detailed UX spec (hover-reveal top provider bar,
inline reasoning/tool steps instead of accordions, per-model placeholder/
quick-actions/theming, date-grouped sidebar, hover-revealed message
actions) modeled on assistant-ui.com. The spec also asked for a parallel
`store/hooks/providers/types` folder architecture and shadcn/ui +
assistant-ui packages; per `AGENTS.md` (which the spec itself says wins
on conflict), this patch implements the **UX behavior** inside the
existing architecture instead — see the plan file's "Deliberate
deviations" section for the full reasoning, summarized in
`docs/handoff.md`. Planned via `EnterPlanMode`/`ExitPlanMode` given the
size (10 files touched, 3 new) and to get explicit sign-off before a
redesign this broad, especially right after the scroll-ui incident above.

**Changes:**
- `src/lib/ecosystem/types.ts` / `data.ts`: added `Model.placeholder` and
  `Model.quickActions` (5 chips per model, mock content); removed
  `ToolCall.logs` (no longer rendered — see below).
- `src/lib/ecosystem/use-agent-simulation.ts`: tool-call phase now only
  drives `queued → running → completed`, dropped the per-log-line
  `setTimeout` scheduling (the logs themselves are gone from the type).
- `src/components/thread/turn-steps.tsx` (new): merges reasoning steps
  and tool calls into a single flat animated list — pulsing dot while
  running, green check when done — replacing `reasoning-block.tsx`
  (accordion) and `tool-card.tsx` (bordered card), both deleted. Tool
  calls collapse to one line (`Web Search — 3 results`) instead of
  showing per-log detail.
- `src/components/thread/message-bubble.tsx`: renders `TurnSteps`;
  added a hover-revealed Copy button next to the existing Retry (both
  `opacity-0 group-hover:opacity-100`, same pattern as the sidebar's pin
  button).
- `src/components/composer/composer.tsx`: placeholder is now
  `selectedModel.placeholder`; mounted new `quick-actions.tsx` below the
  input (shown only when the textarea is empty, chips fill the textarea
  on click, same pattern as the existing slash-command chips).
- `src/components/thread/thread-view.tsx`: empty-state headline/subtext
  now resolve the active agent/model via the existing `getAgent`/
  `getModel` helpers instead of static copy.
- `src/components/workspace/sidebar.tsx`: added `groupByDate` (Today /
  Yesterday / Earlier), pinned section unchanged above it.
- `src/components/workspace/top-provider-bar.tsx` (new): hover-revealed
  horizontal model tab row, absolutely positioned over `Topbar` so it
  costs no permanent layout space, desktop-only. Selecting a tab writes
  through the same `sim.setModelForActiveThread` the composer's
  `ModelSelector` already uses, so both stay in sync with no new state
  store.

**Bug found and fixed (pre-existing, unrelated to this patch's own new
code but surfaced while QA-ing it):** `sidebar.tsx`'s `relativeTime()`
called `Date.now()` during render, causing a hydration mismatch between
the static server-prerendered HTML and the client (visible as a Next.js
"1 Issue" dev overlay + red hydration error). Fixed with the canonical
`useSyncExternalStore`-based hydration gate (a `useState`+`useEffect`
"mounted" flag was tried first but rejected by this project's
`react-hooks/set-state-in-effect` lint rule) — see `useHydrated()` in
`sidebar.tsx`.

**Regressions eliminated:** the hydration mismatch above (pre-existing,
not introduced by prior patches in this log, just not caught until this
session's browser QA ran long enough to surface it).

**Validation performed:**
- `bun run build` and `bun run lint` — both clean.
- Full browser QA via the `browse` skill: empty state resolves per
  model; hovering the topbar reveals the 5-model tab row and clicking a
  tab updates the composer's chip, accent, placeholder, and quick
  actions in sync; sending a message renders reasoning + tool steps as a
  flat animated list (no box/accordion) followed by streamed markdown;
  hovering a completed message reveals Copy/Retry; sidebar shows
  Pinned/Today groups; mobile viewport (390×844) shows the hamburger
  drawer, composer `ModelSelector` as the only switch, and no provider
  bar; zero console errors after the hydration fix.

**Status:** Done.

---

## 2026-07-02 — Ground-up rebuild onto the spec's folder tree

**Trigger:** User re-issued the full "AI Assistant UI — Enterprise" redesign
brief and, when asked, explicitly chose **"Rebuild from scratch"** (over
polishing the existing implementation or adding Zustand/shadcn). Direction:
rebuild the whole app on the spec's literal folder tree.

**Deleted:** entire prior `src/components/**` and `src/lib/**`
(`ecosystem/*`, `use-dropdown`, all `workspace/thread/composer/selectors`
components). `src/app/{page,layout,globals.css}` rewritten.

**New structure (spec's tree, adapted to the installed stack):**
- `src/types/` — `model` (+`ProviderTab`), `agent`, `message`, `thread`,
  `provider` (`StreamChunk`, `SendOptions`).
- `src/lib/mock/` — `models` (6: one per provider tab Base/ChatGPT/Claude/
  Grok/Gemini/Perplexity, each with accent+placeholder), `agents` (3),
  `threads` (3 seed), `quick-actions` (per-model).
- `src/lib/ai/` — `provider.interface.ts` (`AIProvider`) +
  `mock.provider.ts` (`MockAIProvider` class, `async* sendMessage`
  yielding `reasoning_step`/`text_delta`, `AbortSignal`-aware). **This is
  the single seam a real provider replaces.**
- `src/lib/utils.ts` — `cn`, `delay`, `uid`, `estimateTokens`,
  `relativeTime`, `dateBucket`.
- `src/store/app-store.ts` — `AppState` (ui/conversation/composer slices),
  `Action` union, pure `reducer`, `selectActiveThread`.
- `src/components/providers/` — `AppProvider` (holds `useReducer`, drives
  `MockAIProvider`, exposes derived active model/agent + actions),
  `ThemeProvider` (publishes active model accent as `--accent`).
- `src/hooks/` — `use-app`, `use-hydrated` (`useSyncExternalStore` gate),
  `use-provider-theme`, `use-composer`, `use-dropdown`.
- `src/components/layout/` — `ChatLayout` (shell + hover zone + header),
  `Sidebar` (search, New Thread, Pinned/Today/Yesterday/Earlier groups),
  `TopProviderBar` (hover-revealed, underlined active tab, `layoutId`).
- `src/components/chat/` — `Conversation` (720px column, auto-scroll,
  reduced-motion aware), `Message` (right user bubble / left assistant with
  avatar + `Agent · Model` label + hover Copy/Retry), `ReasoningSteps`
  (flat inline list, spinner→check, no accordion), `EmptyState` (per-model
  headline), `Markdown` (gfm, styled overrides).
- `src/components/composer/` — `Composer` (auto-resize textarea max 8 rows,
  Enter/Shift+Enter, token counter, attach/mic, accent send↔stop),
  `ModelSelector` + `AgentSelector` (dropdowns via `useDropdown`),
  `QuickActions` (per-model chips seed the prompt).

**Deliberate deviations from the brief (per AGENTS.md "no new deps", which
the brief says wins on conflict):** no Zustand (React `useReducer`+context),
no shadcn/assistant-ui packages (hand-rolled primitives), no
`@radix`/`clsx`. The `store/`, `providers/`, `hooks/`, `types/`,
`lib/ai/` seams the brief wanted all exist — just without the extra
dependencies. CSS design tokens (`--bg-primary` etc.) WERE added this time
(brief spec) in `globals.css`, with `--accent` overridden per model.

**One lint fix during the pass:** `react-hooks/refs` bans writing
`stateRef.current = state` during render; moved the mirror sync into a
`useEffect`.

**Validation:** `bun run build` ✓, `bun run lint` ✓ (both clean). Dev-server
smoke test: `GET / → 200`, page HTML contains the dynamic empty-state
headline, sidebar "New Thread", and seed thread titles; zero server errors.
Interactive in-browser QA (streaming, hover reveal, dropdowns) not yet run
this session — see handoff "known gaps".

**Status:** Done (build/lint verified; interactive browser QA pending).

---

## 2026-07-02 — Organic agent entrance animation

**Trigger:** User wanted the agent rows in the agent picker to stop popping
in as a flat, angular block and instead rise from below with a smooth,
pleasant, spring-like motion.

**Change:** `src/components/composer/agent-selector.tsx` — replaced the
single container fade with a **staggered per-row entrance**: each agent row
starts `opacity:0, y:24, scale:0.9` and springs to rest on
`cubic-bezier(0.34, 1.56, 0.64, 1)` (soft overshoot), 0.55s, `staggerChildren:
0.06` so they cascade. Plays once on mount (dropdown open), never loops.
`will-change: transform, opacity` on each row for hardware acceleration.
Container `overflow-hidden` dropped so the overshoot isn't clipped. Fully
flattened under `prefers-reduced-motion` via `useReducedMotion` +
`staticVariants`.

**Validation:** `bun run build` ✓, `bun run lint` ✓. Interactive motion feel
not yet driven in a browser this session.

**Status:** Done (build/lint verified).

---

## 2026-07-02 — Timelapse reasoning, topbar sub-model switcher, dynamic background

**Trigger (user, IT):** hide the reasoning as a step-list ("a scaletta") and
show a single seamless *timelapse* of what the assistant does; remove "Explore
More"; make the topbar the model switcher showing sub-models + the best model
per task; and on model switch change not just the phrasing but the whole
background (brand-styled per model).

**Changes:**
- **Timelapse** — deleted `chat/reasoning-steps.tsx` (the checklist),
  added `chat/timelapse.tsx`: renders only the *current* activity as one line
  that cross-fades in place to the next phase (shimmer text + pulsing accent
  dot), so intermediate steps read as one continuous block, never a bulleted
  list. `message.tsx` now shows the timelapse only while thinking
  (`streaming && !content`) and hands off to the streamed markdown answer.
  Reduced-motion flattens it.
- **Topbar switcher** — `layout/top-provider-bar.tsx` rewritten:
  now **persistent** (no longer hover-revealed) and the sole desktop model
  chooser. "Explore More" removed. Each tab hover-reveals a popover of the
  model's **sub-models**, each labelled "Best for <task>", with the optimal
  pick flagged **Recommended**. Made persistent because a hover-reveal bar
  can't host hover popovers.
- **Dynamic background** — added `Model.subModels` + `Model.background` (types
  + all 6 models in `lib/mock/models.ts`, brand-tinted radial gradients).
  `providers/theme-provider.tsx` now paints an `AnimatePresence`-keyed
  background layer that cross-fades (0.6s) on model change; `use-provider-theme`
  returns `background`/`modelId`.
- **Cleanup** — removed the now-unused `providerBarVisible` UI state end to
  end (`store/app-store.ts`, `providers/app-provider.tsx`, `ChatLayout`).

**Assumptions (marked):** "choosing dei modelli sulla side bar" — there was no
model selector in the sidebar; interpreted as "make the topbar the desktop
model chooser". The composer's `ModelSelector` is **kept** as the mobile model
switch (topbar is desktop-only). Sub-model names + per-task labels are
plausible mock data. Clicking a sub-model selects its parent model (no separate
sub-model state).

**Validation:** `bun run build` ✓, `bun run lint` ✓. Dev smoke test: `GET / →
200`; "Explore More" absent, "Best for"/"Recommended"/"pick per task" present
in served HTML. Interactive feel (timelapse cross-fade, popover hover,
background cross-fade) not yet driven in a live browser this session.

**Status:** Done (build/lint + server-render verified).

---

## 2026-07-02 — Bold backgrounds + fully-clickable branded sub-models

**Trigger (user, IT):** make the dynamic background much bolder/more evident;
make sub-models clickable; each model + sub-model must carry its family's brand
background with readable details.

**Changes:**
- **Stronger background** — all 6 `Model.background` gradients in
  `lib/mock/models.ts` pushed from ~0.20 alpha to ~0.55–0.62 with a wider
  glow, so the per-model backdrop is clearly evident (still fades to #0a0a0a
  below the fold to keep chat text readable).
- **Branded, clickable switcher** — `layout/top-provider-bar.tsx` rewritten:
  each tab now carries a tint of its own accent (stronger when active, brand
  dot + brand underline); the hover popover is painted with the model's
  **solid brand color**, and every sub-model is a full clickable `<button>`
  row (not inline text). Text/among-brand contrast is guaranteed by
  `readableOn(hex)` (relative-luminance → near-black/white); hover + selection
  overlays and the Recommended pill invert accordingly.
- **Sub-model selection is now real state** — `Thread.subModel?` added;
  `selectModel(id, subModel?)` records the chosen variant (defaults to the
  model's recommended pick via `recommendedSubModel`); `SET_MODEL`/`SET_AGENT`
  carry it. `AppProvider` exposes `activeSubModel`. Selected sub-model shows a
  ✓ in the popover and is reflected in the composer chip ("Claude · Sonnet").
- **New utils** — `hexToRgba` + `readableOn` in `lib/utils.ts`.

**Note:** no separate side-panel/modal was added (the English scaffolding
suggested one, but the Italian ask was brand backgrounds + clickability); the
existing popover already shows each model's details (provider, variant name,
best-for task, recommended). Say the word if a full detail panel is wanted.

**Validation:** `bun run build` ✓, `bun run lint` ✓. Clean prod-server render
(`next start` on an isolated port — earlier curls had hit a stale :3000
server): `Best for` ×16, `Recommended` ×6, composer chip shows `· Sonnet`,
empty state intact. Interactive hover/click feel not yet driven in a browser.

**Status:** Done (build/lint + prod-render verified).

---

## 2026-07-02 — Smoother model switching, de-boxed tabs

**Trigger (user, IT):** "rendi lo switching tra modelli più smooth, leva i box."
The brand-tinted rectangles behind each topbar tab (added earlier the same day)
read as a row of boxes.

**Changes:**
- **De-boxed tabs** — `layout/top-provider-bar.tsx`: removed the per-tab
  `backgroundColor` tint. Tabs are now underline-only (brand dot + text + the
  shared animated underline), which also matches the original spec's "tab
  attivo underlined, non boxed". The active underline now glides between tabs
  with a spring (`layoutId` + spring transition); the brand dot animates
  scale/opacity between active/inactive.
- **Accent now tweens on switch** — registered `--accent` as an animatable
  `@property` (`<color>`, inherits) in `globals.css`, and added
  `[transition:--accent_450ms_ease-out]` to the `ThemeProvider` wrapper that
  declares it. Changing model now color-interpolates the accent across the
  whole UI (send button, focus rings, dots, underline) instead of snapping —
  in step with the existing 0.6s background cross-fade.
- Dropped the now-unused `hexToRgba` import from the switcher (`hexToRgba`
  stays in `lib/utils.ts`, still exported).

**Note on scope:** the English scaffolding described a full-viewport "morphing
model scene" — not applicable to this chat UI. The Italian ask was narrow
(smoother switch + remove the boxy tabs), so that's what was done. The
sub-model popover keeps its solid brand background (explicit request from the
prior turn); it's a hover dropdown, not part of the switch.

**Validation:** `bun run build` ✓, `bun run lint` ✓. Prod-server render (fresh
isolated port): no inline `background-color:rgba` tab tints remain in the HTML,
`@property --accent` present in the CSS bundle, sub-models intact (`Best for`
×16). GPU-friendly throughout (opacity/transform + color interpolation only).
Interactive 60fps feel not driven in a browser this session.

**Status:** Done (build/lint + prod-render verified).

---

## 2026-07-03 — Mobile agent-management drawer (existing stack)

**Trigger (user, IT):** make the agents project phone-friendly and add a
slide-out drawer; referenced the shadcn Radix Drawer docs, "read the docs
first."

**Decision:** the repo has no shadcn/Radix and twice deliberately avoided them
(AGENTS.md "no new deps"). Asked the user via `AskUserQuestion` →
**"Existing stack (Framer Motion)"**. Read the shadcn/Vaul Drawer docs
(WebFetch) and mirrored its semantics without the dependency.

**Changes:**
- **`components/ui/drawer.tsx`** — new accessible Drawer primitive matching the
  shadcn/Vaul contract: `role="dialog"`, `aria-modal`, Title→`aria-labelledby`,
  Description→`aria-describedby` (visually hidden via `sr-only`), focus trap
  (Tab/Shift+Tab cycle), Escape-to-close, focus restore to the trigger, body
  scroll-lock, backdrop click-to-close. Motion is transform/opacity only
  (`will-change: transform`, no layout shift); `prefers-reduced-motion`
  collapses the slide. Full-width on phones (`w-full`), capped at `sm:max-w-sm`.
- **`components/layout/agent-drawer.tsx`** — agent-management drawer: search
  field, **simulated loading skeleton** (350ms, body remounts per open so no
  sync setState-in-effect), **empty state** ("No agents match …"), and
  responsive agent cards (avatar, name, description, tool chips, default model,
  active ✓). Selecting an agent switches it and closes. Independent scroll with
  `overscroll-contain`.
- **State** — `agentDrawerOpen` added to `store/app-store.ts` +
  `AppProvider` (`setAgentDrawerOpen`).
- **Trigger** — `ChatLayout` mobile header gets a right-aligned "Manage agents"
  button (`aria-haspopup="dialog"`, shows the active agent avatar), `md:hidden`
  (desktop keeps the composer agent selector). Deliberately an app-bar action,
  not a bottom FAB: the composer owns the bottom edge, so a bottom FAB would
  overlap it — the top action is the non-conflicting native choice here.

**Assumption/deviation (marked):** did NOT install the literal shadcn/Radix
package (user chose the existing stack); every functional/ARIA requirement is
met with the hand-rolled primitive. Loading is simulated (no backend). Trigger
is a header action rather than a bottom FAB, for the layout reason above.

**Validation:** `bun run build` ✓, `bun run lint` ✓. Prod render: "Manage
agents" trigger + `aria-haspopup="dialog"` present, empty state intact. Drawer
open/close, focus trap, and touch/keyboard behavior not yet driven in a real
mobile browser this session.

**Status:** Done (build/lint + prod-render verified).

---

## 2026-07-03 — Topbar Extra + Specialist buttons & shared model popup

**Trigger (user, IT):** put "Specialist" in the topbar next to an "Extra" item,
after all the models; and make clicking a model open the same kind of popup as
Specialist. Referenced a "Specialist popup" that did not yet exist.

**Decision:** the codebase had no Specialist/Extra buttons and no popup — only
the model tabs' hover popover and the mobile `ui/Drawer`. Asked the user via
`AskUserQuestion` → **build a new centered animated modal** as the shared shell,
and add **both Extra and Specialist** buttons after the models (Specialist
immediately after Extra). One shell defines style/animation/backdrop/a11y so
every popup is identical; only title + body vary.

**Changes:**
- **`components/layout/topbar-modal.tsx`** — new `TopbarModal`: the single popup
  shell reused by every trigger. Centered, fade+scale spring entrance, blurred
  backdrop. Mirrors the Drawer's shadcn/Vaul contract: `role="dialog"`,
  `aria-modal`, Title→`aria-labelledby`, Description→`aria-describedby`
  (`sr-only`), focus trap, Escape-to-close, focus restore to trigger, body
  scroll-lock, backdrop click-to-close. Transform/opacity only;
  `prefers-reduced-motion` collapses the animation.
- **`components/layout/top-provider-bar.tsx`** — after the model tabs, added
  **Extra** (`MoreHorizontal`) and **Specialist** (`Sparkles`) trigger buttons
  sharing the tabs' sizing/spacing. Single `ModalState`
  (`model`/`specialist`/`extra`/null) drives one `TopbarModal`. **Clicking any
  model now selects it AND opens the popup** (hover popover kept as the quick
  path). Bodies: `ModelModalBody` (identity, specs, clickable variant rows that
  record the sub-model via the same `selectModel`), `SpecialistModalBody`
  (Support Specialist agent + tools), `ExtraModalBody` (specialist chat
  launcher).

**Assumption/deviation (marked):** "Specialist" binds to the existing
`support-specialist` agent; "Extra" is a light launcher resurfacing that
specialist entry point (per the user's note that Extra "resumes what's in
specialist"). No backend — bodies are presentational. Model click opening the
modal is additive to selection, not a replacement.

**Validation:** `bun run build` ✓ (TypeScript clean), `bun run lint` ✓.
Popup open/close, focus trap, and animation not yet driven in a real browser
this session.

**Status:** Done (build/lint verified).

---

## 2026-07-03 — Mobile-adapt the topbar popup (bottom-sheet + Save/Close footer)

**Trigger (user, IT):** pasted a shadcn `DrawerDemo` and asked to make the
models/project popup behave like that drawer when used on a mobile device —
"adattalo".

**Decision:** the repo has no shadcn/ui or Vaul and deliberately avoids them
(AGENTS.md "no new deps"; the mobile `ui/Drawer` was already hand-rolled for the
same reason). Reproduced the DrawerDemo *pattern* — bottom sheet, grabber,
scrollable body, footer with primary actions — on the existing `TopbarModal`
via Framer Motion. Desktop keeps the centered fade+scale modal; mobile (≤640px)
becomes a slide-up sheet.

**Changes:**
- **`hooks/use-media-query.ts`** — new reactive `useMediaQuery(query)`. Returns
  false on server/first paint (matchMedia is client-only), syncs after mount.
  `TopbarModal` mounts at page load so the value is correct before any open (no
  desktop→mobile snap).
- **`components/layout/topbar-modal.tsx`** — responsive shell. Mobile: anchored
  `items-end`, `w-full`, `rounded-t-2xl`, `max-h-[90vh]`,
  `pb-[env(safe-area-inset-bottom)]`, a drag **grabber** handle, and a slide-up
  (`y:100%→0`) tween. Desktop: unchanged centered spring. Added a **footer**
  (`Save` primary + `Close`) — stacked full-width `h-11` on mobile for tap
  targets, right-aligned `h-9` row on `sm`. New props `onSave`/`saveLabel`/
  `closeLabel` (Save defaults to onClose — selections apply live, so Save just
  commits + dismisses). Close (X) hit area enlarged to `p-2`. Footer buttons are
  inside the focus trap.
- **`components/layout/top-provider-bar.tsx`** — selecting a variant inside the
  modal no longer auto-closes; it applies live and the footer Save/Close now
  dismisses (matches the drawer "edit then save" flow).

**Assumption/deviation (marked):** did NOT install shadcn/Vaul (used the
existing stack, consistent with prior sessions). "Save" and "Close" both
dismiss because selections are live (no staged/dirty state to persist without a
backend); Save is the primary/commit affordance. Breakpoint is 640px (Tailwind
`sm`).

**Validation:** `bun run build` ✓ (TypeScript clean), `bun run lint` ✓.
Bottom-sheet slide, grabber, footer tap targets, and focus trap not yet driven
in a real mobile browser this session.

**Status:** Done (build/lint verified).

---

## 2026-07-03 — Real microphone: Web Speech dictation + audio capture

**Author:** Claude (agent session)

**Goal:** Make the composer mic button *real* — live speech-to-text you can
actually talk into — while keeping every FAKSIMILE (simulated) feature
(conversation, "generated" answers) strictly client-side/mock. Read the whole
architecture before touching anything (done: types → store → provider → hooks →
composer).

**Changes:**
- New hook **`src/hooks/use-speech-input.ts`** — the one new seam. Wraps three
  browser-native APIs, all client-side, no backend:
  - **Web Speech API** (`SpeechRecognition` / `webkitSpeechRecognition`,
    `continuous` + `interimResults`) for live dictation. Snapshots the current
    composer text on start, then streams interim + final transcripts back via
    `onChange`, so speech appends onto whatever is already typed.
  - **`getUserMedia` + `MediaRecorder`** on the same stream → a real, playable
    recorded clip exposed as an object URL (revoked on discard/unmount).
  - **`AudioContext` + `AnalyserNode`** → a live 0–1 input-level (`level`) that
    drives the mic-button pulse (real audio processing, not a fake animation).
  - Capability detected via `useSyncExternalStore` (server snapshot `false`,
    client re-check) — no hydration mismatch, no setState-in-effect.
  - Minimal inline TS typings for the Web Speech API (absent from the DOM lib);
    error codes mapped to human messages (`not-allowed` → "Microphone access
    denied", `audio-capture` → "No microphone found", etc.); `no-speech` /
    `aborted` treated as benign. Full teardown (recognition, tracks, recorder,
    AudioContext, RAF, object URL) in one `stopAll()`.
- **`src/components/composer/composer.tsx`** — wired the previously visual-only
  mic button to `useSpeechInput`: toggles capture, pulses with input level
  (`box-shadow` scaled by `level`), `aria-pressed` + dynamic `aria-label`,
  disabled with an explanatory title when the API is unsupported. Added a
  "Listening… speak now" status line, an inline error line, and a recorded-clip
  `<audio controls>` + discard button. `handleSend` now stops dictation before
  sending so an in-flight interim word can't clobber the cleared composer.

**Deliberately unchanged (FAKSIMILE stays mock):** `mock.provider.ts`, the
reducer/streaming path, and all AI content remain 100% client-side simulation.
Only the microphone became real. The `+` attach button is still visual-only.

**Breaking changes:** none. **Regressions introduced:** none.

**Assumption/deviation (marked):** Chrome/Safari route `SpeechRecognition`
through the browser vendor's own speech service — that is a *browser-native*
dependency, not an app backend; no server/API/DB was added, consistent with the
"frontend-only" constraint. Recognition language hard-coded to `en-US` (hook
takes a `lang` option for later). MediaRecorder playback is best-effort — if the
browser lacks it, dictation still works.

**Validation:** `bun run build` ✓ (TypeScript clean), `bun run lint` ✓ (fixed a
`react-hooks/set-state-in-effect` error by moving capability detection to
`useSyncExternalStore`). Dev-server smoke test: `GET / → 200`, mic button
server-renders with its aria-label, no SSR errors. Live mic/permission flow and
clip playback not yet driven in a real browser this session (needs a mic + user
gesture — verify in Chrome).

**Status:** Done (build/lint/SSR verified; interactive mic QA pending a real
browser).

---

## 2026-07-03 — Unify Specialist / Model-selector / top-bar popups; drop "Extra"

**Author:** Claude (agent session)

**Trigger (user, IT+EN):** read how the "Specialist" dropdown behaves and
replicate its exact mechanism + visual style for the model selector; make the
top-bar "Specialist" hover-reveal the same agent list in the same style; remove
the "Explore" nav item.

**Reconciliation (marked assumption):** the screenshot brief didn't map 1:1 to
the code. "Explore" no longer exists (its ancestor "Explore More" was removed
2026-07-02); the only leftover trigger beside "Specialist" was the top-bar
**"Extra"** button — user confirmed removing that. The canonical "Specialist
popup" is the composer's `AgentSelector` (staggered spring list of agents).

**Changes:**
- **New `src/components/agent-list.tsx`** — single source of truth for the
  Specialist popup: the `AgentList` list box (avatar/name/description/tools rows)
  plus the shared entrance variants (`popupListVariants` +
  `usePopupRowVariants()`, the `[0.34,1.56,0.64,1]` overshoot spring with
  `staggerChildren`, reduced-motion aware). Extracted verbatim from the old
  `AgentSelector` so nothing changed visually there.
- **`composer/agent-selector.tsx`** — reduced to trigger + `<AgentList>` (passes
  its own `absolute bottom-full left-0` positioning). Behaviour identical.
- **`composer/model-selector.tsx`** — now opens with the **identical** mechanism
  as Specialist: swapped the old `opacity/y:6, 0.15s` fade for
  `popupListVariants` + per-row `usePopupRowVariants()` wrapped in `motion.li`;
  dropped `overflow-hidden` (it clipped the overshoot) so the box matches
  AgentList exactly (same `w-72 rounded-xl border bg-[var(--bg-secondary)] p-1
  shadow-xl`).
- **`layout/top-provider-bar.tsx`** — removed the **"Extra"** `TriggerButton`
  (+ `ExtraModalBody`, `MoreHorizontal` import, `kind:"extra"`). Replaced the
  Specialist `TriggerButton` (which opened a modal with ONE agent) with a new
  `SpecialistPopover`: hover/focus reveals the shared `<AgentList>` (all agents,
  same rows + staggered entrance), anchored `right-0 top-full` with a `pt-2`
  hover bridge; closes on mouse-leave or when focus exits the subtree. Model
  tabs still open the shared `TopbarModal` on click (now model-only).

**Design tokens:** untouched — every element reuses `--border`,
`--bg-secondary`, `--bg-hover`, `--text-*`, `--accent` exactly as before.

**Validation:** `bun run lint` ✓ (clean), `bun run build` ✓ (TypeScript
type-check + static gen pass). No dangling references to the removed symbols.
Interactive browser QA (hover timing on the top-bar popover, per-hover stagger
replay, model-selector open feel) not yet driven in a live browser this session.

**Status:** Done (build/lint verified; interactive QA pending a real browser).

---

## 2026-07-03 — Predefined response library + stateless retry swap

**Author:** Claude (agent session)

**Goal:** Replace the single templated English mock answer with a library of 50
predefined response templates (Italian, enterprise-grade, each with a `primary`
and an alternative `retry` phrasing), and change **Retry** from "re-send the
prompt as a new turn" to an **instant client-side text swap** between the two
variants — no reasoning re-run, no new request (the "wow" regenerate feel).

**Changes:**
- **New `src/lib/mock/responses.ts`** — 50 `ResponseTemplate`s
  (`id`, `scenario`, `primary`, `retry`) across 7 enterprise scenarios
  (data-retrieval, status-update, error-handling, confirmation, analysis,
  recommendation, clarification). Plus a deterministic `pickTemplate(prompt)`
  (FNV-1a hash → stable choice per prompt, no re-render flicker) and
  `getTemplate(id)`.
- **`types/message.types.ts`** — added `ResponseVariant` and, on `Message`,
  `primaryContent` / `retryContent` / `variant`: assistant messages now carry
  both predefined variants so the swap is a pure state mutation.
- **`types/provider.types.ts`** — new `StreamChunk` case
  `{ type: "retry_variant"; content }`, emitted once before the text stream so
  the UI pre-loads the alternative.
- **`lib/ai/mock.provider.ts`** — drops `composeAnswer`/`getModel`; now picks a
  template, yields its `retry` as a `retry_variant` chunk, then word-streams the
  `primary`.
- **`store/app-store.ts`** — new actions `SET_RETRY_VARIANT` (stores
  `retryContent`) and `SWAP_VARIANT` (toggles `variant`, mirrors the chosen text
  into `content`; no-op if no `retryContent`); `END_STREAM` now freezes the
  streamed text as `primaryContent` + sets `variant: "primary"`.
- **`components/providers/app-provider.tsx`** — handles the `retry_variant`
  chunk; exposes `swapVariant(messageId)` on the context.
- **`components/chat/conversation.tsx`** — `onRetry` now calls
  `swapVariant(message.id)` (only when `retryContent` exists) instead of
  re-sending the prompt.
- **`components/chat/message.tsx`** — the answer is wrapped in a `motion.div`
  keyed on `message.variant` so a swap cross-fades (0.18s); key stays constant
  while streaming so deltas don't re-animate.
- **`lib/mock/threads.ts`** — seeded the AWS assistant message with
  `variant`/`primaryContent`/`retryContent` (English, to match the thread) so
  the swap works on the pre-loaded conversation too.

**Breaking changes:** none. `AIProvider` interface unchanged; the `retry_variant`
chunk is additive and a real provider can simply not emit it (retry button then
hides for that message).

**Regressions introduced:** none observed. Old behaviour (retry = new turn) is
intentionally replaced by the swap per the request.

**Validation performed:** `bun run lint` ✓ (clean), `bun run build` ✓
(TypeScript type-check + static gen pass). Interactive browser QA of the swap
(instant toggle, cross-fade, toggling back and forth) not yet driven in a live
browser this session.

**Status:** Done (build/lint verified; interactive QA pending a real browser).

---

## 2026-07-03 — Client-side file upload, editable user messages, "New Chat"

**Author:** Claude (agent session)

**Trigger (user, IT):** make document iteration + "New Chat" + "Copy Chat"
work in the **frontend domain only** ("leggi tutta la documentazione prima").
Clarified via `AskUserQuestion`: (1) *document iteration* = when the user
attaches a PDF/document it actually loads, no backend; (2) *output box* keeps
**Copy + Retry** (Copy must work); (3) *input box* gains the ability to
**edit** a sent message ("modificare l'input"), ChatGPT-style.

**Scope decision (marked):** the whole app is already 100% client-side/mock,
so the brief's "runtime validation to intercept/block backend API calls" was
**not** implemented — there are no backend calls to block, and adding a guard
would be speculative machinery against AGENTS.md ("no overengineering"). The
frontend-only boundary is instead stated in code comments on the new seams.
LocalStorage/IndexedDB persistence was also **not** added: the app has never
persisted state (deliberately, per prior hydration-risk notes), and attachment
object URLs can't survive a reload anyway — kept session-scoped and in-memory.

**Changes:**
- **`types/attachment.types.ts` (new)** — `Attachment { id, name, size, type,
  url }`; `url` is a browser object URL (`URL.createObjectURL`), never uploaded.
  `message.types.ts` gains `attachments?: Attachment[]` on user messages.
- **`store/app-store.ts`** — `AppState.composerAttachments`; actions
  `ADD_ATTACHMENTS` / `REMOVE_ATTACHMENT` / `CLEAR_ATTACHMENTS` (also cleared on
  `CREATE_THREAD`) and `EDIT_MESSAGE` (update a message's content in place).
- **`providers/app-provider.tsx`** — `addAttachments(files)` (maps `File`s to
  object URLs client-side), `removeAttachment(id)` (revokes the URL). Extracted
  the streaming loop into a shared **`streamTurn(thread, history)`** reused by
  both `sendMessage` and the new **`editMessage(messageId, content)`**
  (edits in place, then regenerates a reply appended at the end — the app never
  branches history). `sendMessage` now attaches staged files and sends when
  there is text **or** at least one file. New-chat title renamed
  `"New Thread"` → `"New Chat"`.
- **`hooks/use-composer.ts`** — exposes `attachments` / `addAttachments` /
  `removeAttachment`; `canSend` is true with text **or** attachments.
- **`composer/composer.tsx`** — the `+` button now opens a hidden
  `<input type="file" multiple>` and loads the files client-side; staged files
  render as removable chips (name + size) above the toolbar.
- **`chat/message.tsx`** — user messages render attachment chips (open via the
  object URL) and gain a hover **Edit** action → in-place textarea with
  **Save & send** / **Cancel** (Enter saves, Esc cancels). Assistant messages
  keep **Copy + Retry** unchanged. New `formatBytes` helper in `lib/utils.ts`.
- **`chat/conversation.tsx`** — wires `onEdit`/`canEdit` for user messages.
- **`layout/sidebar.tsx`** — "New Thread" button relabeled "New Chat".

**Breaking changes:** none. **Regressions introduced:** none observed —
`streamTurn` preserves the existing reasoning-step / retry-variant / delta
handling; retry-swap and streaming paths are unchanged.

**Known minor gap:** attachments staged but then abandoned via "New Chat"
leave their object URLs un-revoked until page unload (small, session-scoped).

**Validation performed:** `bun run lint` ✓ (clean), `bun run build` ✓
(TypeScript type-check + static gen pass). Confirmed the mock provider's
`routeResponse` has a fallback topic, so an attachment-only (empty-text) send
does not crash. Interactive browser QA (picking a real file, chip render/remove,
opening the object URL, editing + regenerate, per-message Copy) not yet driven
in a live browser this session.

**Status:** Done (build/lint verified; interactive QA pending a real browser).

---

## 2026-07-03 — Intent-aware response routing (data-driven selection engine)

**Author:** Claude (agent session)

**Goal:** Replace the blind hash pick in the mock provider with a real,
data-driven selection engine: on each user message, map the free-text input to
one of the macro-argument categories that already exist in the codebase, then
draw a predefined answer from *that* category's pool — so the mockup follows a
rigorous topic-based logic instead of returning topic-mismatched text. Closes
the "answers aren't intent-aware" gap flagged in the previous handoff.

**Macro-arguments (topics):** the 7 `ResponseScenario` values already in
`responses.ts` are the macro-arguments — `data-retrieval`, `status-update`,
`error-handling`, `confirmation`, `analysis`, `recommendation`,
`clarification`. The 100 phrasings are the 50 templates × (primary + retry).

**Changes:**
- **`lib/mock/responses.ts`** (additive, the 50 template literals untouched):
  - `MACRO_TOPICS` — the taxonomy: per-topic label, description, and IT+EN
    intent `keywords` (the "logic configuration"). Multi-word entries match as
    phrases.
  - `TEMPLATE_CONTEXT` — a `Record<id, string>` question-context tag for each
    of the 50 templates (finer than the macro-topic; its tokens double as a
    secondary matching signal). Kept as a lookup map so the big literals stay
    as-is and low-risk.
  - `FALLBACK_TEMPLATE` — a full `ResponseTemplate` (so retry-swap still works)
    returned when nothing clears the threshold.
  - `ROUTING_CONFIG` — `{ threshold: 0.6, minFuzzyLen: 4, historySize: 8 }`,
    behaviour as data.
  - `TaggedTemplate` + `buildResponseModel()` — the hierarchical,
    JSON-serialisable view (macro-topic → keywords + tagged pool), built at
    runtime from `RESPONSE_TEMPLATES` so adding a template / a new scenario
    expands the model with no other change (dynamic expansion).
  - **Removed** the now-orphaned `pickTemplate` / `getTemplate` / `hashString`
    (the provider no longer hashes; nothing else referenced them).
- **`lib/ai/response-router.ts`** (new) — the engine. `tokenize` (lowercase,
  trim, Unicode punctuation strip), `levenshtein` + `similarity` (fuzzy match),
  `matchTopic` (best macro-topic by keyword score; ties break by declaration
  order → deterministic topic), `routeResponse` (topic → context-sharpened,
  dedup-aware random pick; static fallback below `threshold`). Module-level
  `recentIds` ring buffer prevents back-to-back duplicates; `resetHistory()`
  for tests/new sessions. RNG is injectable for deterministic tests.
- **`lib/ai/mock.provider.ts`** — swaps `pickTemplate(prompt)` for
  `routeResponse(prompt)`; everything downstream (retry_variant chunk,
  word-streaming) unchanged.
- **`lib/ai/response-router.test.ts`** (new) — 12 `bun test` cases: 100-phrasing
  count, required-field validation, hierarchical grouping, tokenisation,
  Levenshtein, exact + case-insensitive + fuzzy topic routing, fallback on
  gibberish, on-topic guarantee, no back-to-back duplicates, context sharpening.

**Selection algorithm:** normalise → tokenise → score every macro-topic
(exact/substring/Levenshtein, fuzzy only for len ≥ 4 to avoid short-token
noise) → best topic, else fallback if < 0.6 → within the topic, narrow to the
best templates only on a *strong* context hit (≥ 0.9), otherwise keep the whole
pool for variety → drop recently-served ids → random pick.

**Breaking changes:** `pickTemplate` / `getTemplate` removed from the
`responses` module public surface (both were unused after the provider switch).
`AIProvider` interface + all UI components unchanged.

**Regressions introduced:** none observed. Same streaming/retry UX; only the
*which template* decision changed (hash → intent).

**Validation performed:** `bun test` ✓ (12 pass / 0 fail), `bun run lint` ✓
(clean), `bun run build` ✓ (TypeScript type-check + static gen pass). Manual
smoke of `routeResponse` across 11 mixed IT/EN prompts: every prompt routed to
the correct macro-argument, `backup`/`dataset` sharpened to the right template,
gibberish hit the fallback. Interactive in-browser chat QA not driven this
session.

**Status:** Done (test/build/lint verified; live-browser chat QA pending).

## 2026-07-03 — Frontend-coding response topics (DOM / events / state) with real code

**Goal:** the mock assistant could only answer abstract enterprise-agent
prompts (data retrieval, status, errors, …); asking it a real frontend
question ("how do I add a click listener", "gestire lo stato") had no pertinent
answer. Broadened the dataset so it covers **development questions — from code
to common tasks — while staying strictly frontend-only**, and let the existing
intent router pick the most relevant one. No algorithm change: the router is
data-driven, so new topics/templates expand it automatically via
`buildResponseModel()` / `matchTopic()`.

**Changed — `lib/mock/responses.ts`:**
- Extended the `ResponseScenario` union with three coding macro-topics:
  `dom-manipulation`, `event-handling`, `state-management` (exactly the three
  pillars the assistant is meant to cover).
- Added **24 templates (tpl-51…tpl-74), 8 per topic = 48 new phrasings**. Each
  `primary`/`retry` carries a **real, browser-only code snippet** in a markdown
  fence (renders via the existing `Markdown` code-block branch). Italian prose
  (consistent with the existing 50) + English code. Frontend-only by
  construction: `querySelector`/`classList`/`FormData`/`localStorage`/
  `useState`/`useReducer`/Context/vanilla pub-sub store — no backend, no fetch.
  Dataset is now **74 templates / 148 phrasings**.
- Added `MACRO_TOPICS` entries with IT+EN intent keywords for the three topics,
  and 24 `TEMPLATE_CONTEXT` question-context tags.
- **Declaration order matters** (ties break by order in `matchTopic`): the three
  coding topics are declared **right after `data-retrieval`, before
  `status-update`**, so "gestire lo stato" (state) beats the Italian
  `stato` = `status` keyword owned by `status-update`. state-management
  deliberately does **not** claim the bare `stato` token, so pure status
  queries ("qual è lo stato del deploy") still route to `status-update`.

**Changed — `lib/ai/response-router.test.ts`:** replaced the hard-coded
"exactly 50 templates / 100 phrasings" assertion with the durable invariant
(2 phrasings — default + retry — per template, `length ≥ 50`) so the dataset can
grow; added a unique-id check, a frontend-routing test (DOM/event/state +
the `come posso` tie-break), and a check that every frontend template ships a
```code``` fence in both variants. **15 pass / 0 fail.**

**Regressions introduced:** none — all pre-existing routing/fallback/dedup
tests still pass; UI, provider, retry-swap unchanged.

**Known edge (documented, not fixed):** genuinely ambiguous tokens can't be
perfectly separated by a flat max-keyword scorer. e.g. "debounce the search
input" routes to `data-retrieval` because `search` (data) ties `debounce`
(event) and data-retrieval is declared first. Fixing it by reorder introduces
new collisions (`dataset` is shared by data-retrieval and dom). `debounce`/
`throttle` alone route correctly; only co-occurrence with `search` misfires.
Left as-is per the codebase's "loose fit within a topic is expected for a
mockup" stance — a weighted scorer would be overengineering here.

**Validation performed:** `bun test` ✓ (15 pass / 0 fail), `bun run lint` ✓
(clean), `bun run build` ✓ (TypeScript + static gen pass). Manual smoke of
`matchTopic` across 10 mixed IT/EN prompts: 9/10 to the intended topic (the
1 miss is the documented `search`+`debounce` edge); status/data-retrieval
queries unaffected. Interactive in-browser chat QA not driven this session.

**Status:** Done (test/build/lint verified; live-browser chat QA pending).

---

## 2026-07-03 — Vercel production-readiness audit + postcss CVE fix

**Author:** Claude (agent session)

**Goal:** Verify the project deploys cleanly on Vercel with no build,
runtime, config, or security blockers — driven entirely by local backtests
before any deploy.

**Local backtests run (all green):**
- `bun run build` ✓ — Turbopack compile + TypeScript type-check + static
  generation of `/` and `/_not-found` (both `○ Static`, prerendered).
- `bun run lint` ✓ — clean.
- `bun test` ✓ — 15 pass / 0 fail (532 assertions).
- `bun audit` — surfaced one moderate advisory (see below), now clean.

**Vercel-compatibility checks (source grep):**
- No secrets / API keys / `process.env` / `Bearer` tokens hard-coded.
- No Node-runtime-only builtins (`fs`, `net`, `child_process`, `http`…),
  no sockets, no `fetch`/external endpoints — the app is a pure client-side
  mock, so it needs no serverless functions or env config at all.
- No competing lockfile (`package-lock.json`/`yarn.lock`/`pnpm-lock.yaml`) —
  `bun.lock` is the only one, so Vercel auto-detects Bun + Next.js.
- No dangling references to the removed `public/*.svg` assets; `public/` is
  gone and nothing imports from it. Favicon served from `src/app/favicon.ico`.
- No `next/image` usage → `sharp` not required at build/runtime.
- No unguarded browser globals at module top-level (SSR/static-gen safe).
- No `any` / `@ts-ignore` / `eslint-disable` escape hatches in app code.
- Production JS: largest chunk ~222 KB uncompressed (react-dom + framer-motion),
  ~1 MB total across chunks — normal for a React app and well within Vercel's
  limits (Vercel enforces no per-chunk size cap; gzip brings these far down).

**Changed — `package.json`:** added an `overrides` block pinning
`postcss` to `^8.5.16`. `next@16.2.9` shipped a nested `postcss@8.4.31`
(< 8.5.10), vulnerable to GHSA-qx2v-qp2m-jg93 (moderate — XSS via unescaped
`</style>` in CSS stringify output). The top-level dep was already 8.5.16;
the override deduplicates the whole tree onto the patched line. Ran
`bun install --force` to sync the physical tree (nested 8.4.31 removed).

**Regressions introduced:** none — build/lint/test re-run after the dependency
change, all still pass; no source files touched.

**Validation performed:** post-fix `bun run build` ✓, `bun run lint` ✓,
`bun test` ✓ (15/15), `bun audit` ✓ ("No vulnerabilities found").

**Status:** Done — project is Vercel-ready. Deploy needs no env vars or
`vercel.json`; Vercel's zero-config Next.js detection covers it.

## 2026-07-04 — Casual/everyday conversation dataset (9 new macro-topics, +114 templates)

**Why:** the assistant answered enterprise-agent + frontend-coding questions
well but fell straight to the fallback on ordinary conversation ("ciao come
stai", "consigli sull'amore", "che film guardo stasera", "come gestisco il
lavoro"). The request was to expand the mock dataset with 200+ more
casual/daily interaction phrasings so it *seems* to understand common talk,
while staying a deterministic input→output mockup.

**What changed — `src/lib/mock/responses.ts` (data only, zero algorithm change):**
- Extended `ResponseScenario` with 9 conversational topics: `greeting`,
  `smalltalk`, `relationships`, `entertainment`, `daily-life`, `food-cooking`,
  `travel`, `wellbeing`, `career`.
- Added **114 new templates** (`grt-*`, `smt-*`, `rel-*`, `ent-*`, `day-*`,
  `food-*`, `trip-*`, `well-*`, `job-*`), each a `primary` + `retry` phrasing —
  **228 new response strings**. Total dataset now **188 templates = 376
  phrasings** (was 74 = 148). Warm, empathetic Italian prose, no code (the
  casual topics are conversational, the 3 frontend topics keep the code).
- Added 9 `MACRO_TOPICS` entries with hand-curated IT+EN keyword taxonomies.
  **Declared before `recommendation`** so a themed advice ask ("consigli
  sull'amore", "che film mi consigli", "come migliorare al lavoro") wins the
  keyword tie over the generic `recommendation` "consiglio" hit — declaration
  order is the tie-breaker in `matchTopic`. Crucially none of them claim the
  bare `consiglio`/`consigli`/`cosa` tokens, so pure recommendation and
  clarification queries still route correctly (regression-tested).
- Added `TEMPLATE_CONTEXT` tags for all 114 new ids (context-sharpening + the
  test's "every template has a context tag" invariant).
- Rewrote `FALLBACK_TEMPLATE` copy to advertise the broader scope (chit-chat,
  advice on love/films/travel/wellbeing, daily-life help, work, code).
- The English `weather` quick-action prompt now routes to `daily-life` (the
  topic claims `weather`/`meteo`), instead of hitting the fallback.

**Tests — `src/lib/ai/response-router.test.ts`:** +2 cases. One asserts each
of the 9 casual topics routes as expected (greeting/smalltalk/relationships/
entertainment/daily-life/food/travel/wellbeing/career); one guards the
regression that generic `cosa mi consigli` → `recommendation` and
`a che punto è il deploy` → `status-update` despite the new topics being
declared earlier. The existing frontend/tie-break/fallback/dedup/data-model
tests are unchanged and still pass on the larger dataset (they use `>=`
thresholds by design).

**Regression analysis:** the router (`response-router.ts`) and provider
(`mock.provider.ts`) were **not touched** — the engine already derives its
pools from `MACRO_TOPICS` + `RESPONSE_TEMPLATES` at runtime, so adding data
expands coverage with no code change. Verified 18 routing cases by hand
(all casual topics + enterprise/frontend regressions) before wiring the
permanent tests.

**Validation (all green):**
- `bun test` ✓ — 17 pass / 0 fail (1229 assertions).
- `bun run lint` ✓ — clean.
- `bun run build` ✓ — Turbopack compile + TypeScript type-check + static
  generation of `/` and `/_not-found`.

**Not done (deliberate):** the composer quick-action chips stay English and
enterprise/coding-flavoured — the casual dataset is discoverable by just
typing naturally; adding Italian casual chips would be a UI change beyond the
dataset request. No persistence/UI changes.

**Status:** Done — casual conversation now routes to warm, on-topic predefined
answers with an instant retry rephrasing, indistinguishable from the existing
enterprise/coding flows.

## 2026-07-04 — Responsive model selector (top bar on mobile) + token counter removed

**Why:** two requests. (1) Remove the composer's token counter entirely.
(2) Make the model chooser responsive: keep the *same popup mechanism*, but on
narrow viewports relocate the model selector from the composer's bottom toolbar
up into the top bar, under the "New Chat" title, while the Specialist
(`AgentSelector`) stays in the composer.

**What changed:**
- **Token counter gone.** Removed the `{tokenCount} tok` span from
  `composer.tsx`, dropped `tokenCount` from `use-composer.ts`'s return, and
  deleted the now-unused `estimateTokens` helper from `lib/utils.ts` (only the
  counter used it — no dead code left). The `ml-auto` that right-aligns
  mic + send moved to the wrapper unchanged, so the toolbar layout holds.
- **Model selector reposition (CSS-only, SSR-safe).** No new JS media-query
  hook — reused the app's existing `md` breakpoint (the same one that already
  governs mobile vs desktop: sidebar, top provider bar, header actions).
  - `composer.tsx`: wrapped `<ModelSelector />` in `hidden md:block` — desktop
    only.
  - `chat-layout.tsx`: header restructured from a single flex row into a title
    row + a `md:hidden` second row rendering `<ModelSelector placement="down" />`
    directly under "New Chat".
- **`ModelSelector` gained a `placement` prop** (`"up"` default | `"down"`).
  It only flips which way the *same* popup opens — `bottom-full mb-2` (composer)
  vs `top-full mt-2` (top bar). Trigger, list rows, `selectModel`, and the
  staggered spring entrance are untouched, so both mounts are the identical
  popup. Both call `selectModel`, so top-bar and composer can never disagree.

**Specialist untouched:** `AgentSelector` still lives in the composer at all
widths — the "Specialist stays below" requirement is structural, independent of
which agent is active.

**Regression analysis:** the store, providers, response router, and mock
provider were not touched. `ModelSelector`'s only other consideration is the
desktop `TopProviderBar`, which is a separate switcher and also calls
`selectModel` — state stays single-sourced from the active thread's `modelId`,
so no drift. Reduced-motion handling rides along unchanged (variants live in
`agent-list.tsx`).

**Validation (all green):**
- `bun run build` ✓ — Turbopack compile + TypeScript type-check + static gen.
- `bun run lint` ✓ — clean.
- `bun test` ✓ — 17 pass / 0 fail (1229 assertions).

**Not done (deliberate):** the English "Claude.ai clone" framing in the request
(hero image, "How can I help you today?", "Claude · Anthropic", Write/Learn/
Code/Analyze, "Message Claude…" placeholder, forcing model=Claude Sonnet /
persona=Support Specialist) was **not** applied — that would be a destructive
reskin of the provider-agnostic console. Only the two behavioural changes the
user's own Italian instruction asked for were made. A full Claude-branded
reskin remains available as a follow-up if wanted.

**Status:** Done — verified by build/lint/test + code reading; interactive
browser QA of the resize transition not yet run this session.

## 2026-07-04 — Tool Picker Menu (composer "+" dropdown)

**Why:** the composer's `+` button previously opened the OS file picker
directly. Requested: turn it into a ChatGPT-style **Tool Picker Menu** — a
glassmorphism dropdown *above* the input bar listing configurable tools
(upload / image gen / web search / deep research), filterable in real time from
the main input, with click-outside/Escape close and a fade-in + slide-up
(100ms) open animation. Front-end only.

**What was added:**
- **`src/lib/mock/tools.ts`** — `Tool` type + `ToolAction`
  (`upload | image_gen | web_search | deep_research`) + `DEFAULT_TOOLS` (the 4
  spec items, emoji icons by design, Italian labels/descriptions). Configurable
  via the component's `tools` prop; this is just the default set.
- **`src/components/composer/tool-picker-menu.tsx`** — `ToolPickerMenu`
  (`tools`, `isOpen`, `filter?`, `onSelect`). Presentational + **controlled**:
  the parent owns open state and click-outside/Escape (via the existing
  `useDropdown`); the menu only renders, animates, and reports selections.
  Glassmorphism (`bg-[var(--bg-secondary)]/80 backdrop-blur-xl`, thin rounded
  border), anchored `absolute bottom-full` (opens **above**), each row = emoji |
  bold label | muted description with `hover:bg-[var(--bg-hover)]`, footer
  "Digita per cercare plugin, file e skill", and a "Nessuno strumento trovato"
  empty state. `role="menu"`/`menuitem`, focus rings.
- **`globals.css`** — `@utility tool-picker-enter` + `@keyframes` (fade-in +
  slide-up, 100ms). Pure CSS so the menu needs **no motion lib** (honours the
  "React + Tailwind only" constraint); the existing reduced-motion block
  collapses it to instant.

**Wiring (`composer.tsx`):** the `+` now toggles the menu (via a destructured
`useDropdown` — destructured to satisfy `react-hooks/refs`), rotates to an ×
while open, and passes the composer `value` as the live `filter`. `onSelect`:
`upload` fires the existing client-side file picker (unchanged); the other three
set a local `activeTool` mode shown as a dismissible accent pill above the
toolbar (icon + label + ×). The mode clears on send. No store/provider changes —
`activeTool` is local composer state.

**Deliberately not done:** the tool "modes" are **UI flags only** — selecting
Web Search / Deep Research / Crea immagine shows the active-mode pill but does
not change what the mock provider returns (no backend; consistent with the
app's simulated design and AGENTS.md "no overengineering"). Wiring a mode into
the response router would be the follow-up if a real effect is wanted.

**Validation (all green):**
- `bun run build` ✓ — Turbopack compile + TypeScript + static gen.
- `bun run lint` ✓ — clean (hit `react-hooks/set-state-in-effect` and
  `react-hooks/refs` mid-way; resolved by moving the animation to a CSS keyframe
  and destructuring `useDropdown`).
- `bun test` ✓ — 17 pass / 0 fail (1229 assertions).

**Status:** Done — verified by build/lint/test + code reading; interactive
browser QA (open/filter/select/close, reduced-motion) not yet run this session.

## 2026-07-04 — Tool Picker: emoji icons → lucide icons

**Why:** the Tool Picker Menu shipped with emoji glyphs (📎 🖼️ 🌐 📊). Request:
remove the emojis from the "+" additional-tools section. Chosen resolution (via
a clarifying question — the alternatives were text-only or deleting the whole
section): **keep the menu, swap emojis for matching lucide-react line icons**,
consistent with the rest of the app's iconography.

**What changed:**
- `lib/mock/tools.ts`: `Tool.icon` is now a keyed `ToolIcon`
  (`paperclip | image | globe | bar-chart`) instead of an emoji string — pure
  data, same pattern as `quick-actions.ts`. Values updated accordingly.
- `tool-picker-menu.tsx`: added an exported `TOOL_ICONS` map (name → lucide
  `Paperclip`/`Image`/`Globe`/`BarChart3`); rows render `<Icon>` in
  `text-[var(--text-secondary)]` instead of the emoji span.
- `composer.tsx`: the active-mode pill now renders the mapped lucide icon
  (imports `TOOL_ICONS`) instead of `activeToolMeta.icon` emoji.

**Scan:** `grep` over `src/` for Unicode emoji ranges (U+1F000–U+1FAFF,
U+2600–U+27BF) now returns **0** — the 4 tool glyphs were the only emojis in the
interface (chat messages/responses never had any).

**Validation (all green):** `bun run build` ✓ · `bun run lint` ✓ ·
`bun test` ✓ (17 pass / 0 fail).

**Status:** Done — emoji-free, menu + behaviour unchanged. Interactive browser
QA not run this session.
