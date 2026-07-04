import type { Message, ReasoningStep } from "@/types/message.types";
import type { ProviderTab } from "@/types/model.types";
import type { Thread } from "@/types/thread.types";
import type { Attachment } from "@/types/attachment.types";
import { INITIAL_ACTIVE_THREAD_ID, INITIAL_THREADS } from "@/lib/mock/threads";

// Single reducer holding four logical slices (ui / conversation / composer /
// provider). The active model & agent are derived from the active thread —
// one source of truth, so the top bar and composer selector cannot drift.
export interface AppState {
  // ui
  sidebarOpen: boolean;
  agentDrawerOpen: boolean;
  // conversation
  threads: Thread[];
  activeThreadId: string;
  streamingMessageId: string | null;
  // composer
  composerValue: string;
  /** Files staged in the composer, moved onto the message when it is sent. */
  composerAttachments: Attachment[];
  searchQuery: string;
}

export const initialState: AppState = {
  sidebarOpen: false,
  agentDrawerOpen: false,
  threads: INITIAL_THREADS,
  activeThreadId: INITIAL_ACTIVE_THREAD_ID,
  streamingMessageId: null,
  composerValue: "",
  composerAttachments: [],
  searchQuery: "",
};

export type Action =
  | { type: "SET_SIDEBAR"; open: boolean }
  | { type: "SET_AGENT_DRAWER"; open: boolean }
  | { type: "SET_COMPOSER_VALUE"; value: string }
  | { type: "ADD_ATTACHMENTS"; attachments: Attachment[] }
  | { type: "REMOVE_ATTACHMENT"; id: string }
  | { type: "CLEAR_ATTACHMENTS" }
  | { type: "SET_SEARCH"; value: string }
  | { type: "SELECT_THREAD"; id: string }
  | { type: "CREATE_THREAD"; thread: Thread }
  | { type: "PIN_THREAD"; id: string }
  | { type: "SET_MODEL"; threadId: string; modelId: ProviderTab; subModel: string }
  | { type: "SET_AGENT"; threadId: string; agentId: string; modelId: ProviderTab; subModel: string }
  | { type: "APPEND_MESSAGE"; threadId: string; message: Message }
  | { type: "EDIT_MESSAGE"; threadId: string; messageId: string; content: string }
  | { type: "START_STREAM"; messageId: string }
  | { type: "ADD_STEP"; threadId: string; messageId: string; step: ReasoningStep }
  | { type: "APPEND_DELTA"; threadId: string; messageId: string; content: string }
  | { type: "SET_RETRY_VARIANT"; threadId: string; messageId: string; content: string }
  | { type: "END_STREAM"; threadId: string; messageId: string }
  | { type: "SWAP_VARIANT"; threadId: string; messageId: string };

function updateThread(
  state: AppState,
  threadId: string,
  fn: (t: Thread) => Thread,
): Thread[] {
  return state.threads.map((t) => (t.id === threadId ? fn(t) : t));
}

function updateMessage(
  thread: Thread,
  messageId: string,
  fn: (m: Message) => Message,
): Thread {
  return {
    ...thread,
    updatedAt: Date.now(),
    messages: thread.messages.map((m) => (m.id === messageId ? fn(m) : m)),
  };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_SIDEBAR":
      return { ...state, sidebarOpen: action.open };
    case "SET_AGENT_DRAWER":
      return { ...state, agentDrawerOpen: action.open };
    case "SET_COMPOSER_VALUE":
      return { ...state, composerValue: action.value };
    case "ADD_ATTACHMENTS":
      return {
        ...state,
        composerAttachments: [...state.composerAttachments, ...action.attachments],
      };
    case "REMOVE_ATTACHMENT":
      return {
        ...state,
        composerAttachments: state.composerAttachments.filter((a) => a.id !== action.id),
      };
    case "CLEAR_ATTACHMENTS":
      return { ...state, composerAttachments: [] };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.value };
    case "SELECT_THREAD":
      return { ...state, activeThreadId: action.id, sidebarOpen: false };
    case "CREATE_THREAD":
      return {
        ...state,
        threads: [action.thread, ...state.threads],
        activeThreadId: action.thread.id,
        sidebarOpen: false,
        composerValue: "",
        composerAttachments: [],
      };
    case "PIN_THREAD":
      return {
        ...state,
        threads: updateThread(state, action.id, (t) => ({ ...t, pinned: !t.pinned })),
      };
    case "SET_MODEL":
      return {
        ...state,
        threads: updateThread(state, action.threadId, (t) => ({
          ...t,
          modelId: action.modelId,
          subModel: action.subModel,
        })),
      };
    case "SET_AGENT":
      return {
        ...state,
        threads: updateThread(state, action.threadId, (t) => ({
          ...t,
          agentId: action.agentId,
          modelId: action.modelId,
          subModel: action.subModel,
        })),
      };
    case "APPEND_MESSAGE":
      return {
        ...state,
        threads: updateThread(state, action.threadId, (t) => ({
          ...t,
          updatedAt: Date.now(),
          messages: [...t.messages, action.message],
        })),
      };
    case "EDIT_MESSAGE":
      return {
        ...state,
        threads: updateThread(state, action.threadId, (t) =>
          updateMessage(t, action.messageId, (m) => ({ ...m, content: action.content })),
        ),
      };
    case "START_STREAM":
      return { ...state, streamingMessageId: action.messageId };
    case "ADD_STEP":
      return {
        ...state,
        threads: updateThread(state, action.threadId, (t) =>
          updateMessage(t, action.messageId, (m) => ({
            ...m,
            steps: [
              ...(m.steps ?? []).map((s) => ({ ...s, status: "done" as const })),
              action.step,
            ],
          })),
        ),
      };
    case "APPEND_DELTA":
      return {
        ...state,
        threads: updateThread(state, action.threadId, (t) =>
          updateMessage(t, action.messageId, (m) => ({
            ...m,
            steps: (m.steps ?? []).map((s) => ({ ...s, status: "done" as const })),
            content: m.content + action.content,
          })),
        ),
      };
    case "SET_RETRY_VARIANT":
      return {
        ...state,
        threads: updateThread(state, action.threadId, (t) =>
          updateMessage(t, action.messageId, (m) => ({
            ...m,
            retryContent: action.content,
          })),
        ),
      };
    case "END_STREAM":
      return {
        ...state,
        streamingMessageId: null,
        threads: updateThread(state, action.threadId, (t) =>
          updateMessage(t, action.messageId, (m) => ({
            ...m,
            streaming: false,
            // Freeze the streamed text as the primary variant so a later retry
            // swap can toggle back to it.
            primaryContent: m.content,
            variant: "primary",
            steps: (m.steps ?? []).map((s) => ({ ...s, status: "done" as const })),
          })),
        ),
      };
    // Instant, stateless retry: flip between the two predefined variants and
    // mirror the chosen text into `content`. No model call, no re-streaming.
    case "SWAP_VARIANT":
      return {
        ...state,
        threads: updateThread(state, action.threadId, (t) =>
          updateMessage(t, action.messageId, (m) => {
            if (m.retryContent === undefined) return m;
            const nextVariant = m.variant === "retry" ? "primary" : "retry";
            const primary = m.primaryContent ?? m.content;
            return {
              ...m,
              variant: nextVariant,
              content: nextVariant === "retry" ? m.retryContent : primary,
            };
          }),
        ),
      };
    default:
      return state;
  }
}

export const selectActiveThread = (state: AppState): Thread =>
  state.threads.find((t) => t.id === state.activeThreadId) ?? state.threads[0];
