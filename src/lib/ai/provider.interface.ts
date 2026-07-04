import type { Message } from "@/types/message.types";
import type { SendOptions, StreamChunk } from "@/types/provider.types";

// The one seam a real backend plugs into. Swap MockAIProvider for an
// Anthropic/OpenAI/Vercel-AI implementation of this interface and no UI
// component needs to change.
export interface AIProvider {
  readonly id: string;
  sendMessage(
    messages: Message[],
    options: SendOptions,
  ): AsyncIterable<StreamChunk>;
}

export type { SendOptions, StreamChunk };
