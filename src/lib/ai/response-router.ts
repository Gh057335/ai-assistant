// Intent-aware response router for the mock provider.
//
// The chat is frontend-only, but answers must not be random noise: this engine
// maps the user's free-text message to one of the macro-argument categories
// defined in `lib/mock/responses.ts`, then draws a predefined template from that
// category's pool. The pipeline is:
//
//   normalise → tokenise → score every macro-topic (fuzzy, Levenshtein) →
//   pick the best topic above a threshold (else fallback) → within the topic,
//   prefer the template whose question-context best fits → random pick among
//   the equally-relevant, non-recently-used candidates.
//
// It is deterministic in its *topic* choice (same input → same topic) but
// randomised in its *template* choice, so repeated identical prompts feel
// alive without ever leaving the matched macro-argument.

import {
  FALLBACK_TEMPLATE,
  MACRO_TOPICS,
  RESPONSE_TEMPLATES,
  ROUTING_CONFIG,
  TEMPLATE_CONTEXT,
  type ResponseScenario,
  type ResponseTemplate,
} from "@/lib/mock/responses";

export interface RouteResult {
  /** The selected predefined template (primary + retry phrasings). */
  template: ResponseTemplate;
  /** Matched macro-topic, or "fallback" when nothing cleared the threshold. */
  topicId: ResponseScenario | "fallback";
  /** Best topic similarity score in [0, 1]. */
  score: number;
  /** The keyword that produced the best match, for debugging/telemetry. */
  matchedKeyword: string | null;
  /** True when the fallback template was returned. */
  isFallback: boolean;
}

// ── Text normalisation ─────────────────────────────────────────────────────

/** Lowercase, trim, strip punctuation, split into word tokens. Unicode-aware so
 *  accented Italian input ("perché", "già") tokenises cleanly. */
export function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// ── Fuzzy string similarity (Levenshtein) ──────────────────────────────────

/** Classic edit-distance DP with a rolling row (O(min·max) time, O(min) space). */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1, // deletion
        curr[j - 1] + 1, // insertion
        prev[j - 1] + cost, // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

/** Normalised similarity in [0, 1]; 1 = identical. */
export function similarity(a: string, b: string): number {
  const max = Math.max(a.length, b.length);
  if (max === 0) return 1;
  return 1 - levenshtein(a, b) / max;
}

// ── Scoring ─────────────────────────────────────────────────────────────────

const { threshold, minFuzzyLen, historySize } = ROUTING_CONFIG;

/** Score a single keyword against the tokenised (and joined) input. */
function scoreKeyword(tokens: string[], joined: string, keyword: string): number {
  const kw = keyword.toLowerCase();

  // Multi-word keyword ("non funziona", "how to"): phrase containment only.
  if (kw.includes(" ")) return joined.includes(kw) ? 1 : 0;

  let best = 0;
  for (const token of tokens) {
    if (token === kw) return 1; // exact token hit — can't do better
    // Fuzzy only for reasonably long strings, so 2–3 char tokens can't collide.
    if (kw.length >= minFuzzyLen && token.length >= minFuzzyLen) {
      const contained = token.includes(kw) || kw.includes(token);
      best = Math.max(best, contained ? 0.9 : similarity(token, kw));
    }
  }
  return best;
}

interface TopicMatch {
  topicId: ResponseScenario;
  score: number;
  matchedKeyword: string | null;
}

/** Best-matching macro-topic for the input (highest keyword score wins). Ties
 *  break by MACRO_TOPICS declaration order, keeping topic choice deterministic. */
export function matchTopic(input: string): TopicMatch {
  const tokens = tokenize(input);
  const joined = tokens.join(" ");
  let winner: TopicMatch = { topicId: MACRO_TOPICS[0].id, score: 0, matchedKeyword: null };

  for (const topic of MACRO_TOPICS) {
    for (const keyword of topic.keywords) {
      const score = scoreKeyword(tokens, joined, keyword);
      if (score > winner.score) {
        winner = { topicId: topic.id, score, matchedKeyword: keyword };
        if (score === 1) break; // perfect keyword hit for this topic
      }
    }
  }
  return winner;
}

/** How well a template's question-context tag fits the input (0..1). */
function contextScore(tokens: string[], joined: string, templateId: string): number {
  const context = TEMPLATE_CONTEXT[templateId];
  if (!context) return 0;
  const contextTokens = context.split(/\s+/).filter(Boolean);
  let best = 0;
  for (const ct of contextTokens) {
    best = Math.max(best, scoreKeyword(tokens, joined, ct));
  }
  return best;
}

// ── De-duplication across cycles ────────────────────────────────────────────

// Recently-served template ids (module-level, session-lived). Prevents the same
// template being returned twice in a row, satisfying "no duplicate selection
// within an interaction cycle" while keeping consecutive answers varied.
const recentIds: string[] = [];

function remember(id: string): void {
  recentIds.push(id);
  while (recentIds.length > historySize) recentIds.shift();
}

/** Reset the de-dup history — used by tests and when starting a fresh session. */
export function resetHistory(): void {
  recentIds.length = 0;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Route a user prompt to a predefined response template.
 *
 * @param prompt   Raw user input (any case, any whitespace, any punctuation).
 * @param random   Injectable RNG for deterministic tests. Defaults to Math.random.
 */
export function routeResponse(
  prompt: string,
  random: () => number = Math.random,
): RouteResult {
  const { topicId, score, matchedKeyword } = matchTopic(prompt);

  // No topic cleared the bar → predefined static fallback.
  if (score < threshold) {
    return {
      template: FALLBACK_TEMPLATE,
      topicId: "fallback",
      score,
      matchedKeyword: null,
      isFallback: true,
    };
  }

  const tokens = tokenize(prompt);
  const joined = tokens.join(" ");
  const pool = RESPONSE_TEMPLATES.filter((t) => t.scenario === topicId);

  // Rank the pool by question-context fit. Only narrow to the best-fitting
  // templates when the context signal is STRONG (near-exact match); a weak,
  // noisy signal must not collapse the pool — we keep the whole topic for
  // variety and let the RNG choose.
  const CONTEXT_STRONG = 0.9;
  const ranked = pool
    .map((t) => ({ t, ctx: contextScore(tokens, joined, t.id) }))
    .sort((a, b) => b.ctx - a.ctx);
  const topCtx = ranked[0]?.ctx ?? 0;
  let candidates =
    topCtx >= CONTEXT_STRONG
      ? ranked.filter((r) => r.ctx === topCtx).map((r) => r.t)
      : pool;

  // Drop recently-served templates unless that would empty the pool.
  const fresh = candidates.filter((t) => !recentIds.includes(t.id));
  if (fresh.length > 0) candidates = fresh;

  const template = candidates[Math.floor(random() * candidates.length)] ?? pool[0];
  remember(template.id);

  return { template, topicId, score, matchedKeyword, isFallback: false };
}
