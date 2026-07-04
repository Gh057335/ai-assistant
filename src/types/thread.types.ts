import type { Message } from "./message.types";
import type { ProviderTab } from "./model.types";

export interface Thread {
  id: string;
  title: string;
  agentId: string;
  modelId: ProviderTab;
  /** Selected sub-model variant name; falls back to the model's recommended pick. */
  subModel?: string;
  pinned: boolean;
  messages: Message[];
  updatedAt: number;
}
