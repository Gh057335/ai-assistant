import type { Agent } from "@/types/agent.types";

export const AGENTS: Agent[] = [
  {
    id: "research-analyst",
    name: "Research Analyst",
    description: "Research & synthesis",
    avatar: "R",
    color: "#6366f1",
    tools: ["Web Search", "Document Reader", "Citation Checker"],
    defaultModel: "claude",
  },
  {
    id: "code-engineer",
    name: "Code Engineer",
    description: "Codebase & debugging",
    avatar: "C",
    color: "#22c55e",
    tools: ["Code Interpreter", "Repo Search", "Test Runner"],
    defaultModel: "chatgpt",
  },
  {
    id: "support-specialist",
    name: "Support Specialist",
    description: "Concise customer-facing help",
    avatar: "S",
    color: "#eab308",
    tools: ["Knowledge Base", "Ticket Lookup"],
    defaultModel: "claude",
  },
];

export const DEFAULT_AGENT_ID = AGENTS[0].id;

export const getAgent = (id: string): Agent =>
  AGENTS.find((a) => a.id === id) ?? AGENTS[0];
