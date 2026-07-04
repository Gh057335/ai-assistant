import type { AIProvider } from "./provider.interface";
import type { Message } from "@/types/message.types";
import type { SendOptions, StreamChunk } from "@/types/provider.types";
import { getAgent } from "@/lib/mock/agents";
import { routeResponse } from "./response-router";
import { delay, uid } from "@/lib/utils";

const STEP_DELAY = 320;
const WORD_DELAY = 22;

// Derive plausible reasoning-step labels from the agent's tools + the prompt,
// so the simulated "thinking" reads as contextual rather than canned.
function planSteps(agentId: string, prompt: string): string[] {
  const agent = getAgent(agentId);
  const topic = prompt.trim().slice(0, 48) || "the request";
  const toolStep = agent.tools[0] ? `Using ${agent.tools[0]}` : "Gathering context";
  return [
    `Parsing request: "${topic}"`,
    toolStep,
    "Cross-referencing findings for consistency",
    "Drafting a synthesized answer",
  ];
}

export class MockAIProvider implements AIProvider {
  readonly id = "mock";

  async *sendMessage(
    messages: Message[],
    options: SendOptions,
  ): AsyncIterable<StreamChunk> {
    const { signal, agentId } = options;
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const prompt = lastUser?.content ?? "";

    for (const label of planSteps(agentId, prompt)) {
      if (signal?.aborted) return;
      yield { type: "reasoning_step", id: uid("step"), label };
      await delay(STEP_DELAY);
    }

    // Route the prompt to a macro-topic and draw a template from that topic's
    // pool (intent-aware, not a blind hash), then hand the retry variant to the
    // UI up front so the retry button can swap text without a round-trip.
    const { template } = routeResponse(prompt);
    if (signal?.aborted) return;
    yield { type: "retry_variant", content: template.retry };

    const words = template.primary.split(/(\s+)/);
    for (const word of words) {
      if (signal?.aborted) return;
      yield { type: "text_delta", content: word };
      if (word.trim()) await delay(WORD_DELAY);
    }
  }
}

export const mockProvider = new MockAIProvider();
