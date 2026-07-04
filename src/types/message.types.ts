import type { ProviderTab } from "./model.types";
import type { Attachment } from "./attachment.types";

export type MessageRole = "user" | "assistant";

/** A single inline reasoning/tool step, shown as flat text (never an accordion). */
export interface ReasoningStep {
  id: string;
  label: string;
  status: "running" | "done";
}

/** Which predefined variant of an assistant answer is currently displayed. */
export type ResponseVariant = "primary" | "retry";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  /** Files attached by the user, loaded client-side (no upload). User messages only. */
  attachments?: Attachment[];
  /** Present only on assistant messages. */
  steps?: ReasoningStep[];
  modelId?: ProviderTab;
  agentId?: string;
  /** True while the assistant response is still being produced. */
  streaming?: boolean;
  createdAt: number;
  // ── Stateless retry ──────────────────────────────────────────────────
  // Assistant messages carry both predefined variants so the retry button
  // can swap the displayed text purely client-side, without re-running the
  // model or issuing a new request.
  /** The originally streamed answer. */
  primaryContent?: string;
  /** The alternative phrasing shown after a retry swap. */
  retryContent?: string;
  /** Variant currently mirrored into `content`. Defaults to "primary". */
  variant?: ResponseVariant;
}
