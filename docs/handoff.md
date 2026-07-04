# Handoff

Live project context, rewritten on every patch — not a changelog (see
`docs/session.md` for that). Read this first to pick up where the last
session left off.

## Where we are

A single-page dark-theme **AI assistant console** at `/`, rebuilt from
scratch on 2026-07-02 onto the redesign brief's literal folder tree, then
iterated. Current shape: a **persistent topbar model switcher** (Base /
ChatGPT / Claude / Grok / Gemini / Perplexity) where each tab hover-reveals
its **sub-models** with the best task per variant + a Recommended pick and,
after the models, a **Specialist** trigger (the old **Extra** button was
removed 2026-07-03). Clicking a model **tab** opens the **shared popup**
(`TopbarModal`) — same style/animation/backdrop/a11y/footer for every model,
only the body differs. The **Specialist** trigger instead **hover/focus-reveals
the shared `AgentList`** — the exact same popup, rows, and staggered spring
entrance the composer's Specialist dropdown uses (see "Unified popups" below).
The model modal is **responsive**: a centered fade+scale modal on desktop, a slide-up
**bottom sheet** (grabber, scrollable body, big `Save`/`Close` touch targets) on
mobile (≤640px); a
minimal date-grouped sidebar; a centered chat column with a dynamic
empty-state headline and a single **"timelapse"** activity line (not a step
checklist); a responsive composer; and a **per-model dynamic background** that
cross-fades on model switch. Everything is client-side and simulated — no
backend, no real model calls.

**Tool Picker Menu (2026-07-04):** the composer's `+` button opens a
glassmorphism dropdown **above** the input bar (`ToolPickerMenu` in
`components/composer/`, data in `lib/mock/tools.ts`) listing configurable tools
(upload / image gen / web search / deep research) — lucide icon (Paperclip /
Image / Globe / BarChart3, via the exported `TOOL_ICONS` map; `Tool.icon` is a
keyed name, no emoji) | bold label | muted description, footer "Digita per
cercare plugin, file e skill". It's
**controlled**: the composer owns open state + click-outside/Escape (via
`useDropdown`) and passes the composer `value` as a live `filter`. `onSelect`:
`upload` opens the existing client-side file picker; the other three set a local
`activeTool` mode shown as a dismissible pill above the toolbar (cleared on
send). Open animation is a pure CSS keyframe (`tool-picker-enter` in
`globals.css`, fade-in + slide-up 100ms — no motion lib, per the "React +
Tailwind only" ask; reduced-motion collapses it). The tool modes are **UI flags
only** — they don't yet change the mock provider's output.

**Responsive model selector (2026-07-04):** the composer's `ModelSelector`
**relocates by viewport width**. At `md`+ it sits in the composer's bottom
toolbar (opens upward); below `md` the composer hides it (`hidden md:block`) and
it re-renders in the **top-bar header under "New Chat"** (`md:hidden`, via
`ModelSelector placement="down"`, opens downward). Same component, trigger,
popup, and staggered entrance in both spots — only the open direction flips.
The **Specialist** (`AgentSelector`) stays in the composer at all widths. This
is pure Tailwind `md:` (no JS media query), so it's SSR-safe with no hydration
flash. The **token counter was removed** entirely (the `{tokenCount} tok`
readout, the `use-composer` field, and the unused `estimateTokens` util all
gone).

The **previous** implementation (`src/lib/ecosystem/*`, `src/components/
{workspace,thread,composer,selectors}/*`) was **deleted wholesale** — the user
explicitly chose "rebuild from scratch" over polishing it.

## Architecture (provider-agnostic by design)

```
src/
  types/                model/agent/message/thread/provider type defs
  lib/
    mock/               models, agents, threads, quick-actions seed data
                        + responses.ts (188 primary/retry templates = 376
                        phrasings, tagged into 19 macro-topics + keyword taxonomy
                        + question-context tags + fallback + routing config).
                        7 enterprise-agent topics + 3 frontend-coding topics
                        (DOM / events / state, real browser-only code snippets)
                        + 9 casual/everyday topics (greeting, smalltalk,
                        relationships, entertainment, daily-life, food-cooking,
                        travel, wellbeing, career — warm conversational prose).
    ai/
      provider.interface.ts   AIProvider — the one seam a real backend fills
      mock.provider.ts        MockAIProvider (async* stream of chunks)
      response-router.ts      intent router: input → macro-topic → template
      response-router.test.ts bun test suite for the router (17 cases)
    utils.ts            cn, delay, uid, estimateTokens, relativeTime, dateBucket
  store/app-store.ts    AppState + Action union + pure reducer + selectors
  components/
    providers/          AppProvider (reducer + drives MockAIProvider),
                        ThemeProvider (--accent per active model)
    layout/             ChatLayout (shell), Sidebar, TopProviderBar, TopbarModal,
                        AgentDrawer
    chat/               Conversation, Message, Timelapse, EmptyState, Markdown
    composer/           Composer, ModelSelector, AgentSelector, QuickActions
    agent-list.tsx      AgentList + shared popup entrance variants (see below)
    ui/                 Drawer (accessible slide-out primitive)
  hooks/                use-app, use-hydrated, use-provider-theme,
                        use-composer, use-dropdown, use-media-query
  app/                  layout.tsx (providers), page.tsx (ChatLayout), globals.css
```

**The single seam a real model plugs into is `src/lib/ai/mock.provider.ts`.**
Replace `MockAIProvider` with an implementation of `AIProvider` (Anthropic /
OpenAI / Vercel AI SDK / etc.) and no UI component changes.

## Unified popups (Specialist / model selector / top-bar Specialist)

As of 2026-07-03, three surfaces share ONE popup look + entrance so they read as
one system — the whole point of the change:

- **`src/components/agent-list.tsx`** is the single source of truth. It exports
  `AgentList` (the box + agent rows: avatar, name, description, tool chips) and
  the entrance variants `popupListVariants` + `usePopupRowVariants()` (the
  `[0.34,1.56,0.64,1]` overshoot spring, `staggerChildren`, reduced-motion
  aware). The box is always `w-72 rounded-xl border border-[var(--border)]
  bg-[var(--bg-secondary)] p-1 shadow-xl`; the caller passes only positioning
  via `className`.
- **Composer `AgentSelector`** = trigger + `<AgentList>` anchored above
  (`absolute bottom-full left-0`). This is the canonical "Specialist" dropdown.
- **Composer `ModelSelector`** reuses `popupListVariants` +
  `usePopupRowVariants()` so it opens with the *identical* staggered spring (it
  renders `ModelRow`s, not agents — same motion, model content).
- **Top-bar `SpecialistPopover`** (`layout/top-provider-bar.tsx`) hover/focus-
  reveals `<AgentList>` anchored `right-0 top-full` with a `pt-2` hover bridge;
  mounting on hover replays the entrance each time. To restyle any of them,
  edit `agent-list.tsx` once.

## How state flows

- One `useReducer` in `AppProvider` holds all UI + conversation + composer
  state (`src/store/app-store.ts`). The active **model and agent are derived
  from the active thread's `modelId`/`agentId`** — a single source of truth,
  so the top provider bar and the composer's model selector cannot drift.
- `sendMessage` appends a user message + an empty streaming assistant
  message, then consumes `mockProvider.sendMessage(...)`: `reasoning_step`
  chunks become inline steps (previous ones flip to `done`), a one-shot
  `retry_variant` chunk stores the alternative answer on the message
  (`retryContent`), and `text_delta` chunks append to content. Cancellation is
  an `AbortController` per turn; the composer send button becomes a Stop button
  while streaming.
- **Predefined answers + stateless retry** (2026-07-03): `mock.provider.ts`
  draws from `lib/mock/responses.ts` — 188 templates, each a `primary` + a
  `retry` rephrasing — now selected **by intent** via `routeResponse`
  (`lib/ai/response-router.ts`) instead of a blind prompt hash: the input is
  mapped to one of the 19 macro-topics (fuzzy keyword match), then a template is
  drawn from that topic's pool (see "Intent-aware routing" below).
  `END_STREAM` freezes the streamed text as `primaryContent` (`variant:
  "primary"`). The Retry button no longer re-sends the prompt: `swapVariant`
  (`SWAP_VARIANT` action) toggles `variant` and mirrors the chosen text into
  `content` — a pure client-side mutation, instant, no re-run. `message.tsx`
  cross-fades the swap via a `motion.div` keyed on `variant`.
- `stateRef` mirrors committed state for async callbacks — synced in a
  `useEffect`, **never written during render** (`react-hooks/refs` lint rule).

## Intent-aware routing (2026-07-03)

The mock provider no longer hashes the prompt to a random template; it routes by
topic. The data-driven model lives in `lib/mock/responses.ts`, the algorithm in
`lib/ai/response-router.ts`.

- **Macro-topics = the 19 `ResponseScenario`s** in the code — 7 enterprise-agent
  (`data-retrieval`, `status-update`, `error-handling`, `confirmation`,
  `analysis`, `recommendation`, `clarification`), 3 **frontend-coding** topics
  added 2026-07-03 (`dom-manipulation`, `event-handling`, `state-management`)
  whose templates contain **real, browser-only code snippets**, and 9
  **casual/everyday** topics added 2026-07-04 (`greeting`, `smalltalk`,
  `relationships`, `entertainment`, `daily-life`, `food-cooking`, `travel`,
  `wellbeing`, `career`) so the assistant also holds a normal conversation —
  "ciao come stai", "consigli sull'amore", "che film guardo stasera", "come
  gestisco il lavoro" — not just agent/dev chatter. `MACRO_TOPICS` adds IT+EN
  intent `keywords` per topic; `TEMPLATE_CONTEXT` tags each of the 188 templates
  with a finer question-context.
  `buildResponseModel()` returns the hierarchical (macro-topic → keywords +
  tagged templates) JSON-serialisable view, derived at runtime so adding a
  template or a whole new scenario expands the pool with no other change — this
  is exactly how the 3 coding topics were bolted on.
- **Declaration order = tie-breaker.** `matchTopic` breaks equal keyword scores
  by `MACRO_TOPICS` order. The 3 coding topics are declared **before
  `status-update`** so "gestire lo stato" (state) wins over the Italian
  `stato` = `status` keyword; `state-management` deliberately omits the bare
  `stato` token so pure status queries still route to `status-update`. The 9
  casual topics are declared **before `recommendation`** so a themed advice ask
  ("consigli sull'amore" → relationships, "che film mi consigli" → entertainment,
  "come migliorare al lavoro" → career) beats the generic `recommendation`
  "consiglio" hit; none of them claim the bare `consiglio`/`consigli`/`cosa`
  tokens, so plain "cosa mi consigli" still routes to `recommendation`.
- **Pipeline** (`routeResponse`): normalise (lowercase/trim/strip punctuation) →
  tokenise → score every topic by keyword match (exact/substring, then
  Levenshtein `similarity`, fuzzy only for tokens ≥ 4 chars) → pick the best
  topic, or the **static `FALLBACK_TEMPLATE`** if the top score is below
  `ROUTING_CONFIG.threshold` (0.6) → inside the topic, narrow to the
  best-fitting templates **only on a strong context hit** (≥ 0.9), else keep the
  whole pool → drop recently-served ids (`recentIds` ring buffer, no back-to-back
  repeats) → random pick. RNG is injectable for deterministic tests;
  `resetHistory()` clears the de-dup history.
- **Tunables are data** (`ROUTING_CONFIG`): `threshold`, `minFuzzyLen`,
  `historySize`. Topic choice is deterministic (ties break by declaration
  order); only the template pick is randomised.

## What's done / verified

- `bun run build` ✓ and `bun run lint` ✓ — both clean.
- Dev-server smoke test: `GET / → 200`; page HTML contains the per-model
  empty-state headline, sidebar "New Chat", and seed thread titles; zero
  server errors.
- Feature set: persistent topbar switcher with **underline-only tabs** (no box
  tints — the active underline springs between tabs via `layoutId`, the brand
  accent color-interpolates across the whole UI on switch via an animatable
  `@property --accent`); each tab's popover is painted in the model's **solid
  brand color** (contrast-safe text via `readableOn`); every sub-model is a
  clickable row that records a
  real `Thread.subModel` selection (✓ in popover, reflected in the composer
  chip as "Model · SubModel"); a bold per-model **dynamic cross-fading
  background** (~0.55–0.62 alpha) synced with the composer selector; single
  **timelapse** activity line while
  thinking (cross-fades in place, no checklist), then streamed markdown;
  simulated word-streaming; hover Copy/Retry; date-grouped sidebar
  (Pinned/Today/Yesterday/Earlier); dynamic empty state; auto-scroll; mobile
  drawer; full markdown; a11y focus rings + aria labels;
  `prefers-reduced-motion` handling; staggered spring entrance on the agent
  picker rows; **mobile agent-management drawer** (`ui/Drawer` primitive +
  `AgentDrawer`) with ARIA dialog semantics, focus trap, Escape, focus restore,
  body scroll-lock, search, simulated loading skeleton, empty state, and
  full-width-on-phone slide — built on Framer Motion, no shadcn/Radix dep
  (user chose the existing stack over installing them).
- **Real client-side file upload + editable input** (2026-07-03): the composer
  `+` button opens a real `<input type="file" multiple>` and **loads** picked
  files entirely in the browser via `URL.createObjectURL` — **no upload, no
  backend**. Staged files show as removable chips (name + size); on send they
  move onto the user message (`Message.attachments`, type in
  `src/types/attachment.types.ts`) and render as chips that open straight from
  their object URL. You can now **send with a file and no text**. User messages
  also gained a hover **Edit** action (`editMessage` in `app-provider.tsx`):
  in-place textarea, **Save & send** / **Cancel** (Enter/Esc), which updates the
  message content and regenerates a reply (appended — the app never branches
  history). Assistant messages keep **Copy + Retry** unchanged. The streaming
  loop was extracted into a shared `streamTurn(thread, history)` reused by both
  `sendMessage` and `editMessage`. The sidebar button and empty-thread title are
  now **"New Chat"** (was "New Thread"). All client-side/mock; the boundary is
  stated in code comments on the new seams. **Not** added (deliberate, per
  AGENTS.md "no overengineering" + the app's existing no-persistence design): the
  brief's runtime "backend-call blocker" (nothing to block) and
  LocalStorage/IndexedDB persistence (object URLs can't survive a reload).
- **Real microphone** (2026-07-03): the composer mic button is now live, not
  decorative. `src/hooks/use-speech-input.ts` wraps three browser-native APIs,
  all client-side/no backend: **Web Speech API** for live speech-to-text that
  appends onto the composer text (`continuous` + `interimResults`),
  **`getUserMedia` + `MediaRecorder`** for a real playable recorded clip, and
  **`AudioContext`/`AnalyserNode`** for a live input-level that pulses the
  button. Capability gated via `useSyncExternalStore` (no hydration mismatch).
  UI: pulsing accent button + `aria-pressed`, "Listening…" status line, error
  line (permission denied / no mic), inline `<audio>` clip + discard. Unsupported
  browsers get a disabled button with an explanatory title. The mic and the file
  upload above are the only *real* subsystems — everything else stays
  simulated/mock.

## Deliberate deviations from the brief

Per `AGENTS.md` ("no new deps" — which the brief itself says wins on
conflict):

- **No Zustand** — state is `useReducer` + React context. The `store/` folder
  and slice structure the brief wanted still exist; just no dependency.
- **No shadcn/ui, Radix, or assistant-ui packages** — dropdowns, buttons, the
  markdown surface, and the mobile Drawer are hand-rolled with Tailwind +
  Framer Motion. The 2026-07-03 shadcn-Radix-Drawer request was met on the
  existing stack by explicit user choice (`ui/Drawer` mirrors the shadcn/Vaul
  ARIA contract). (`react-markdown` + `remark-gfm` were already installed.)
- **CSS design tokens WERE added** this time (`--bg-primary` etc. in
  `globals.css`) per the brief, with `--accent` overridden per model.

## Known gaps / what's fragile

- **Interactive in-browser QA not yet run this session** — build/lint and a
  server-render smoke test pass, but streaming, hover-reveal, dropdown,
  mobile-drawer, the **model-tab popup** (`TopbarModal`, centered on desktop /
  **bottom sheet on mobile** with a Save/Close footer), and the new **unified
  popups** (composer model selector's staggered open + the top-bar
  `SpecialistPopover` hover/focus reveal) have only been verified by reading the
  code + build/lint, not driven in a real browser. Resize below 640px (or use
  device emulation) to exercise the mobile sheet. Run the `browse` skill (or
  `bun run dev`) to confirm before shipping — in particular hover timing on the
  top-bar Specialist popover and per-hover stagger replay.
- **Model tab click still opens the popup on every click** (additive to
  selecting the model). If that feels heavy, gate it (e.g. only when already
  active, or move the popup to a caret) — the shell (`TopbarModal`) stays the
  same either way. The top-bar **Specialist** no longer opens a modal; it hover-
  reveals the full agent list (`AgentList`) and clicking a row selects that
  agent (same `selectAgent` action as the composer dropdown).
- **Popup `Save`/`Close` both dismiss** — selections apply live, so there's no
  staged/dirty state to persist. If a real backend adds editable settings,
  give `TopbarModal` an `onSave` that commits a draft (the prop already exists).
- **Retry** now does an **instant in-place variant swap** (not a re-send): it
  toggles between the message's `primaryContent` and `retryContent` — the two
  predefined phrasings from `responses.ts` — with a cross-fade, no model re-run
  and no new turn. Repeated clicks toggle back and forth (only two variants).
  Messages without a `retryContent` (e.g. a future real provider that doesn't
  emit `retry_variant`) simply don't show a Retry button.
- The **mic button is now real** (Web Speech + `getUserMedia`/`MediaRecorder`/
  `AnalyserNode`, see above) — but its interactive flow (permission prompt, live
  transcription, level pulse, clip playback) has **only been verified by
  build/lint/SSR + code reading, not driven in a real browser** with a mic this
  session. Speech recognition needs a user gesture, a working mic, and a
  Chromium/Safari engine (Firefox lacks `SpeechRecognition`); `lang` is
  hard-coded `en-US`. Note Chrome/Safari send recognition audio to their vendor
  speech service — browser-native, *not* an app backend.
- The Attach (`+`) button is now a **real client-side file load** (object URLs,
  no backend). Files are attached to the message but their content is **not
  parsed/sent to the model** — the mock provider ignores them; wiring real PDF
  text extraction (client-side) would be the next step if the answer should
  reflect the file. Attachments are **session-only** (no persistence; object
  URLs die on reload), and ones staged then abandoned via "New Chat" aren't
  URL-revoked until page unload.
- `MockAIProvider` answers come from a fixed pool of **188** predefined
  templates (`lib/mock/responses.ts`), now selected **by intent** (see
  "Intent-aware routing" below): the prompt is routed to the closest macro-topic
  and a template is drawn from that topic's pool, with a static fallback when
  nothing matches. The template is guaranteed on-topic (correct macro-argument);
  *within* a topic the pick is context-sharpened but otherwise random, so the
  exact sub-question phrasing may still be a loose fit — expected for a mockup.
  All template prose is **Italian** (per request) while the surrounding demo UI +
  seed threads are English — a deliberate language mix; the **3 frontend-coding
  topics** keep Italian prose but ship **English code snippets**, and the **9
  casual topics** (greeting/smalltalk/relationships/entertainment/daily-life/
  food/travel/wellbeing/career) are warm conversational Italian, no code.
  Keyword lists in `MACRO_TOPICS` are hand-curated; extend them (or the
  templates) to broaden coverage.
- **Router ambiguity edge (frontend topics):** the flat max-keyword scorer can't
  separate genuinely ambiguous tokens. e.g. *"debounce the search input"* routes
  to `data-retrieval` because `search` ties `debounce` and data-retrieval is
  declared first; `debounce`/`throttle` on their own route correctly. A
  reorder just moves the collision (`dataset` is shared by data-retrieval + dom).
  Left as-is (documented) rather than adding a weighted scorer — consistent with
  "loose fit within a topic is expected for a mockup".
- Sidebar "Yesterday"/"Earlier" buckets now have real seed coverage
  (`t-bug` = 26h ago, `t-inquiry` = 4d ago) but weren't visually confirmed
  in a browser this session.
- Anything reading `Date.now()`/`new Date()` during render is a hydration
  risk (app is statically prerendered). `relativeTime` in the sidebar is
  gated behind `useHydrated()`; gate any new time-dependent UI the same way.
- The **response router** has a `bun test` suite (`response-router.test.ts`, 17
  cases: routing incl. frontend + casual topics + tie-break, generic-advice
  regression guard, fuzzy match, fallback, dedup, data-model integrity, unique
  ids, frontend code-block coverage). The rest of the UI still has no automated
  tests, and there is no CI.

## Deployment (Vercel)

The project is **Vercel-ready with zero config** (audited 2026-07-03):

- **Framework auto-detection** works — `bun.lock` is the only lockfile, so
  Vercel picks Bun + Next.js 16 and runs `next build` unaided. No `vercel.json`
  is needed or present.
- **No env vars / secrets required.** The whole app is a client-side mock — no
  `process.env`, no `fetch`, no external endpoints, no serverless functions, no
  Node-runtime builtins (`fs`/`net`/`child_process`). `/` and `/_not-found`
  prerender as fully static content.
- **No `next/image`**, so `sharp` isn't pulled at build/runtime (it's listed in
  `trustedDependencies` but unused — harmless).
- **Security:** `bun audit` is clean. A `postcss` `overrides` pin (`^8.5.16`)
  in `package.json` deduplicates away `next`'s nested vulnerable
  `postcss@8.4.31` (GHSA-qx2v-qp2m-jg93). Keep the override until a future
  `next` ships a patched postcss, then it can be dropped.
- **Local gate before any deploy:** `bun run build && bun run lint && bun test
  && bun audit` — all must be green (they are).
- Uncommitted at audit time: the `public/*.svg` boilerplate was deleted (nothing
  references it) and several files are modified/untracked — commit before
  deploying so Vercel builds the intended tree.

## Next priorities

1. Run interactive browser QA (streaming, provider-bar hover, both
   selectors, mobile drawer, Copy/Retry) — the one unverified surface. Include
   the **model-selector resize transition**: shrink below `md` (e.g. iPhone 12
   Pro, 390px) and confirm the selector leaves the composer and appears under
   "New Chat" in the top bar, its popup opens downward, and the Specialist stays
   in the composer.
2. **Drive the real mic in a browser** — grant/deny permission, dictate into
   the composer, confirm the level pulse + "Listening…" line, play back and
   discard the recorded clip, and check the unsupported-browser disabled state
   (e.g. Firefox). This is the one new surface unverified interactively.
3. If a real provider is wanted, implement `AIProvider` in a new file under
   `src/lib/ai/` and swap the `mockProvider` import in `app-provider.tsx`.
4. If attached files should influence the answer, add client-side text
   extraction (e.g. read `.txt`/`.md` with `FileReader`, PDF via a browser lib)
   and feed it to the mock provider; expose a `lang` selector for the mic if
   non-English is needed. Optionally persist threads to LocalStorage (mind the
   hydration gate) — object-URL attachments still won't survive a reload.
