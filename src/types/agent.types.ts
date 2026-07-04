import type { ProviderTab } from "./model.types";

export interface Agent {
  id: string;
  name: string;
  description: string;
  /** Single-letter avatar glyph. */
  avatar: string;
  /** Hex colour for the avatar chip. */
  color: string;
  /** Informational tool chips — not interactive. */
  tools: string[];
  /** Model this agent defaults to when selected. */
  defaultModel: ProviderTab;
}
