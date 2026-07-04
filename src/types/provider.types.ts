import type { Message } from "./message.types";
import type { ProviderTab } from "./model.types";

/** Streamed chunk emitted by an AIProvider. */
export type StreamChunk =
  | { type: "reasoning_step"; id: string; label: string }
  | { type: "text_delta"; content: string }
  // Emitted once, before the text stream: the alternative phrasing that the
  // retry button swaps to. Lets the UI pre-load the variant so the swap is
  // instant and needs no follow-up request.
  | { type: "retry_variant"; content: string };

export interface SendOptions {
  modelId: ProviderTab;
  agentId: string;
  signal?: AbortSignal;
}
export type { Message };
