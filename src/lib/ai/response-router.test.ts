import { test, expect, beforeEach } from "bun:test";
import {
  levenshtein,
  similarity,
  tokenize,
  matchTopic,
  routeResponse,
  resetHistory,
} from "./response-router";
import {
  RESPONSE_TEMPLATES,
  MACRO_TOPICS,
  TEMPLATE_CONTEXT,
  buildResponseModel,
} from "@/lib/mock/responses";

beforeEach(() => resetHistory());

// ── Data-model integrity ────────────────────────────────────────────────────

test("every template pairs a default + a retry phrasing", () => {
  // The dataset grows as new macro-topics are added; the invariant that holds
  // is 2 phrasings (default + retry) per template, not a fixed headcount.
  const phrasings = RESPONSE_TEMPLATES.flatMap((t) => [t.primary, t.retry]);
  expect(phrasings.length).toBe(RESPONSE_TEMPLATES.length * 2);
  expect(RESPONSE_TEMPLATES.length).toBeGreaterThanOrEqual(50);
});

test("template ids are unique", () => {
  const ids = new Set(RESPONSE_TEMPLATES.map((t) => t.id));
  expect(ids.size).toBe(RESPONSE_TEMPLATES.length);
});

test("every template has required fields: topic, content, context", () => {
  const topicIds = new Set(MACRO_TOPICS.map((m) => m.id));
  for (const t of RESPONSE_TEMPLATES) {
    expect(topicIds.has(t.scenario)).toBe(true); // valid macro-topic
    expect(t.primary.length).toBeGreaterThan(0); // content
    expect(t.retry.length).toBeGreaterThan(0);
    expect(TEMPLATE_CONTEXT[t.id]?.length ?? 0).toBeGreaterThan(0); // context tag
  }
});

test("hierarchical model groups every template under its macro-topic", () => {
  const model = buildResponseModel();
  const grouped = model.reduce((n, topic) => n + topic.templates.length, 0);
  expect(grouped).toBe(RESPONSE_TEMPLATES.length);
  for (const topic of model) {
    for (const t of topic.templates) {
      expect(t.topicId).toBe(topic.id);
      expect(t.context.length).toBeGreaterThan(0);
    }
  }
});

// ── Normalisation & fuzzy primitives ────────────────────────────────────────

test("tokenize lowercases, trims and strips punctuation", () => {
  expect(tokenize("  Recupera i DATI!!! ")).toEqual(["recupera", "i", "dati"]);
});

test("levenshtein / similarity behave", () => {
  expect(levenshtein("recupera", "recupera")).toBe(0);
  expect(levenshtein("recupera", "recuperami")).toBe(2);
  expect(similarity("abc", "abc")).toBe(1);
  expect(similarity("dati", "dato")).toBeGreaterThan(0.6);
});

// ── Topic routing (case-insensitive, fuzzy) ─────────────────────────────────

test("exact keywords route to the expected macro-topic", () => {
  expect(matchTopic("Puoi recuperare i dati?").topicId).toBe("data-retrieval");
  expect(matchTopic("a che punto è il deploy").topicId).toBe("status-update");
  expect(matchTopic("ho un errore 500").topicId).toBe("error-handling");
  expect(matchTopic("conferma il pagamento").topicId).toBe("confirmation");
  expect(matchTopic("analizza le vendite").topicId).toBe("analysis");
  expect(matchTopic("cosa mi consigli").topicId).toBe("recommendation");
});

test("frontend coding questions route to their macro-topic", () => {
  expect(matchTopic("come seleziono un elemento nel DOM").topicId).toBe(
    "dom-manipulation",
  );
  expect(matchTopic("come aggiungo un event listener al click").topicId).toBe(
    "event-handling",
  );
  expect(matchTopic("come gestisco lo state con useState").topicId).toBe(
    "state-management",
  );
  // Keyword-tie disambiguation: "come posso" (recommendation) vs the
  // frontend intent — the concrete coding topic must win.
  expect(matchTopic("come posso gestire lo stato in react").topicId).toBe(
    "state-management",
  );
});

test("casual / everyday questions route to their macro-topic", () => {
  expect(matchTopic("ciao come stai?").topicId).toBe("greeting");
  expect(matchTopic("chi sei e cosa sai fare").topicId).toBe("greeting");
  expect(matchTopic("raccontami una barzelletta").topicId).toBe("smalltalk");
  expect(matchTopic("mi dai un consiglio sull'amore?").topicId).toBe(
    "relationships",
  );
  expect(matchTopic("ho litigato con la mia ragazza").topicId).toBe(
    "relationships",
  );
  expect(matchTopic("che film mi consigli per stasera?").topicId).toBe(
    "entertainment",
  );
  expect(matchTopic("ricordami di chiamare il dentista").topicId).toBe(
    "daily-life",
  );
  expect(matchTopic("cosa cucino stasera?").topicId).toBe("food-cooking");
  expect(matchTopic("dove posso andare in vacanza?").topicId).toBe("travel");
  expect(matchTopic("mi sento molto stressato").topicId).toBe("wellbeing");
  expect(matchTopic("come mi preparo per un colloquio di lavoro?").topicId).toBe(
    "career",
  );
});

test("casual topics do not steal generic recommendation / status queries", () => {
  // The casual advice topics are declared before `recommendation`, but they
  // never claim the bare "consiglio"/"consigli" or "cosa" tokens — so a generic
  // advice ask still lands on `recommendation`, and a plain status ask on
  // `status-update`.
  expect(matchTopic("cosa mi consigli").topicId).toBe("recommendation");
  expect(matchTopic("a che punto è il deploy").topicId).toBe("status-update");
});

test("frontend templates ship runnable code blocks in both variants", () => {
  const frontend = new Set([
    "dom-manipulation",
    "event-handling",
    "state-management",
  ]);
  const fe = RESPONSE_TEMPLATES.filter((t) => frontend.has(t.scenario));
  expect(fe.length).toBeGreaterThanOrEqual(20);
  for (const t of fe) {
    expect(t.primary).toContain("```");
    expect(t.retry).toContain("```");
  }
});

test("matching is case-insensitive", () => {
  expect(matchTopic("ANALIZZA QUESTO").topicId).toBe("analysis");
  expect(matchTopic("analizza questo").topicId).toBe("analysis");
});

test("fuzzy matching tolerates typos above threshold", () => {
  // "recuperami" is 2 edits from the keyword "recupera" → similarity 0.8.
  const r = matchTopic("recuperami i datti");
  expect(r.topicId).toBe("data-retrieval");
  expect(r.score).toBeGreaterThanOrEqual(0.6);
});

// ── Fallback ─────────────────────────────────────────────────────────────────

test("unrecognised input triggers the static fallback", () => {
  const r = routeResponse("zzzz kkkk jjjj");
  expect(r.isFallback).toBe(true);
  expect(r.topicId).toBe("fallback");
  expect(r.template.id).toBe("tpl-fallback");
});

// ── Selection: stays on-topic, no duplicates in a cycle ─────────────────────

test("selection never leaves the matched macro-topic", () => {
  const seq = [0.0, 0.25, 0.5, 0.75, 0.99];
  let i = 0;
  const rng = () => seq[i++ % seq.length];
  for (let n = 0; n < 5; n++) {
    const r = routeResponse("mostrami i dati del report", rng);
    expect(r.topicId).toBe("data-retrieval");
    expect(r.template.scenario).toBe("data-retrieval");
  }
});

test("consecutive picks avoid immediate duplicates", () => {
  const ids = new Set<string>();
  const seq = [0.1, 0.4, 0.7, 0.9, 0.2, 0.6];
  let i = 0;
  const rng = () => seq[i++ % seq.length];
  for (let n = 0; n < 4; n++) {
    ids.add(routeResponse("recupera i dati", rng).template.id);
  }
  // data-retrieval has 8 templates; four dedup-aware picks must be distinct.
  expect(ids.size).toBe(4);
});

test("question-context sharpens the pick within a topic", () => {
  // "backup" context tag lives on tpl-12 inside status-update.
  const r = routeResponse("com'è andato il backup di stanotte");
  expect(r.topicId).toBe("status-update");
  expect(r.template.id).toBe("tpl-12");
});
