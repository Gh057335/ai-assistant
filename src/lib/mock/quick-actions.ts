import type { ProviderTab } from "@/types/model.types";

export type QuickActionIcon =
  | "cloud"
  | "code"
  | "pencil"
  | "bar-chart-3"
  | "lightbulb"
  | "search"
  | "file-text"
  | "git-compare"
  | "check-circle"
  | "book-open";

export interface QuickAction {
  label: string;
  icon: QuickActionIcon;
  /** Prompt seeded into the composer when the chip is clicked. */
  prompt: string;
}

const DEFAULT_ACTIONS: QuickAction[] = [
  { label: "Weather", icon: "cloud", prompt: "What's the weather like today?" },
  { label: "Code", icon: "code", prompt: "Write a function that " },
  { label: "Write", icon: "pencil", prompt: "Help me write " },
  { label: "Analyze", icon: "bar-chart-3", prompt: "Analyze this data: " },
  { label: "Brainstorm", icon: "lightbulb", prompt: "Brainstorm ideas for " },
];

// Only models that diverge from the default set need an entry.
const BY_MODEL: Partial<Record<ProviderTab, QuickAction[]>> = {
  claude: [
    { label: "Write", icon: "pencil", prompt: "Help me write " },
    { label: "Learn", icon: "book-open", prompt: "Explain the concept of " },
    { label: "Code", icon: "code", prompt: "Write a function that " },
    { label: "Analyze", icon: "bar-chart-3", prompt: "Analyze this: " },
  ],
  perplexity: [
    { label: "Search", icon: "search", prompt: "Search the web for " },
    { label: "Summarize", icon: "file-text", prompt: "Summarize " },
    { label: "Compare", icon: "git-compare", prompt: "Compare " },
    { label: "Fact-check", icon: "check-circle", prompt: "Fact-check this claim: " },
  ],
};

export const quickActionsFor = (modelId: ProviderTab): QuickAction[] =>
  BY_MODEL[modelId] ?? DEFAULT_ACTIONS;
