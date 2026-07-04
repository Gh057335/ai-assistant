import type { Thread } from "@/types/thread.types";

const now = Date.now();
const min = 60_000;
const hour = 60 * min;
const day = 24 * hour;

export const INITIAL_THREADS: Thread[] = [
  {
    id: "t-aws",
    title: "Reducing AWS spend 20%",
    agentId: "research-analyst",
    modelId: "claude",
    pinned: true,
    updatedAt: now - 44 * min,
    messages: [
      {
        id: "m-aws-1",
        role: "user",
        content: "How do we cut our AWS bill by 20% without hurting reliability?",
        createdAt: now - 45 * min,
      },
      {
        id: "m-aws-2",
        role: "assistant",
        modelId: "claude",
        agentId: "research-analyst",
        steps: [
          { id: "s1", label: "Parsing request", status: "done" },
          { id: "s2", label: "Identifying relevant sources", status: "done" },
          { id: "s3", label: "Cross-referencing findings", status: "done" },
          { id: "s4", label: "Drafting a synthesized answer", status: "done" },
        ],
        content:
          "A 20% reduction is realistic across four levers:\n\n1. **Eliminate idle resources** — unattached EBS volumes, idle load balancers, and over-provisioned dev environments.\n2. **Right-size compute** — match instance families to actual CPU/memory usage.\n3. **Commit to Savings Plans** — 1-year commitments on steady-state workloads.\n4. **Tier cold storage** — move infrequently accessed data to S3 Glacier.\n\nStart with idle-resource cleanup — it is the lowest-risk lever and usually the fastest 5–8%.",
        // Seeded so the retry swap works on load: `content` mirrors the active
        // variant, while the two *Content fields hold the pair the button toggles.
        variant: "primary" as const,
        primaryContent:
          "A 20% reduction is realistic across four levers:\n\n1. **Eliminate idle resources** — unattached EBS volumes, idle load balancers, and over-provisioned dev environments.\n2. **Right-size compute** — match instance families to actual CPU/memory usage.\n3. **Commit to Savings Plans** — 1-year commitments on steady-state workloads.\n4. **Tier cold storage** — move infrequently accessed data to S3 Glacier.\n\nStart with idle-resource cleanup — it is the lowest-risk lever and usually the fastest 5–8%.",
        retryContent:
          "You can reach 20% by pulling four levers, roughly in order of effort:\n\n1. **Clear out idle waste first** — orphaned EBS volumes, unused load balancers, and always-on dev environments are pure loss.\n2. **Right-size what remains** — align instance families with real CPU and memory demand instead of peak guesses.\n3. **Lock in Savings Plans** — a 1-year commitment on predictable, steady-state workloads.\n4. **Cool down cold data** — shift rarely-read objects to S3 Glacier tiers.\n\nI'd start with the idle-resource pass: lowest risk, and it usually recovers 5–8% within days.",
        createdAt: now - 44 * min,
      },
    ],
  },
  {
    id: "t-bug",
    title: "500 on non-numeric user id",
    agentId: "code-engineer",
    modelId: "chatgpt",
    pinned: false,
    updatedAt: now - 26 * hour,
    messages: [
      {
        id: "m-bug-1",
        role: "user",
        content: "Why does /api/users/:id return 500 when the id is non-numeric?",
        createdAt: now - 26 * hour,
      },
    ],
  },
  {
    id: "t-inquiry",
    title: "User Inquiry",
    agentId: "support-specialist",
    modelId: "claude",
    pinned: false,
    updatedAt: now - 4 * day,
    messages: [],
  },
];

export const INITIAL_ACTIVE_THREAD_ID = INITIAL_THREADS[INITIAL_THREADS.length - 1].id;
