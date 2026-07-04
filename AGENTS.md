# AGENTS.md

Single source of truth for any coding agent working in this repository
(Claude Code, Codex, Gemini, Cursor, or otherwise). `CLAUDE.md` and any other
agent-entrypoint file only point here — do not duplicate this content
elsewhere.

## Philosophy

- Less is more. Fewer files, fewer abstractions, fewer moving parts.
- No overengineering. Build what the task needs, nothing speculative.
- Production-first mindset, even in prototype code — no throwaway hacks that
  quietly become permanent.
- Every change must be easy for the next reader to understand in one pass.
- Prefer simplicity over cleverness.

## Stack notes

- Runtime & package manager: **Bun only**. `bun install`, `bun dev`,
  `bun run build`, `bun test`. Never `npm`/`yarn`/`pnpm`/`node`.
- Next.js **16** (App Router) on React 19 — this is a very recent major
  version. Before writing Next.js-specific code, check
  `node_modules/next/dist/docs/` for the current API; do not assume APIs or
  conventions from older Next.js training data.
- Styling: Tailwind CSS 4 utility classes. Avoid ad-hoc CSS files.

## Project structure

```
src/app/                   routes (App Router)
src/components/            shared presentational components
src/components/variants/   prototype UI variants (throwaway — see docs/handoff.md)
src/lib/                   mock data, hooks, non-visual logic
docs/                      operational docs (session log + live handoff)
```

## Development rules

- TypeScript strict. No `any` without a one-line comment justifying it.
- Functional components only, no class components.
- No premature abstraction — duplication of a few lines beats a speculative
  shared helper used once.
- Validate only at real system boundaries (user input, external calls). Trust
  internal function contracts.
- Naming: kebab-case filenames, PascalCase components, camelCase
  functions/variables.
- Never leave half-finished implementations or dead code in a merged patch.

## Mandatory workflow

Every patch — regardless of size — follows this cycle. Skipping a step means
the patch is not done.

```
Understand → Plan → Implement → Self Review → Regression Analysis
→ Validation → Documentation Update → Done
```

## Mandatory final validation

Before calling any patch complete, verify:

- [ ] `bun run build` succeeds (includes TypeScript type-check)
- [ ] `bun run lint` is clean
- [ ] Existing tests pass (`bun test` — none exist yet; once added, this
      becomes required)
- [ ] No obvious regressions in behavior touched by the patch
- [ ] Naming and structure stay consistent with the rest of the codebase
- [ ] Documentation is updated (see below)

If any check fails, the patch is **not** done — fix it before moving on.

## Mandatory documentation update

Every patch must update, without exception:

- `docs/session.md` — append an entry (never rewrite history)
- `docs/handoff.md` — rewrite to reflect the current state

## Further reading

Only go deeper than this file when necessary:

- [docs/session.md](docs/session.md) — chronological changelog of every patch
- [docs/handoff.md](docs/handoff.md) — current state, open risks, next steps

No other documentation files exist. Create one only when a real, recurring
need justifies it (e.g. `docs/architecture.md` once there's a real backend or
data model to describe) — never preventively.
