"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import {
  initialState,
  reducer,
  selectActiveThread,
  type AppState,
} from "@/store/app-store";
import type { Agent } from "@/types/agent.types";
import type { Model, ProviderTab } from "@/types/model.types";
import type { Thread } from "@/types/thread.types";
import type { Message } from "@/types/message.types";
import type { Attachment } from "@/types/attachment.types";
import { AGENTS, DEFAULT_AGENT_ID, getAgent } from "@/lib/mock/agents";
import { DEFAULT_MODEL_ID, MODELS, getModel, recommendedSubModel } from "@/lib/mock/models";
import { mockProvider } from "@/lib/ai/mock.provider";
import { uid } from "@/lib/utils";

export interface AppContextValue {
  // data
  models: Model[];
  agents: Agent[];
  threads: Thread[];
  activeThread: Thread;
  activeThreadId: string;
  activeModel: Model;
  activeAgent: Agent;
  /** Name of the active sub-model variant (defaults to the recommended pick). */
  activeSubModel: string;
  // ui state
  sidebarOpen: boolean;
  agentDrawerOpen: boolean;
  composerValue: string;
  /** Files staged in the composer (loaded client-side, not yet sent). */
  composerAttachments: Attachment[];
  searchQuery: string;
  isStreaming: boolean;
  // ui actions
  setSidebarOpen: (open: boolean) => void;
  setAgentDrawerOpen: (open: boolean) => void;
  setComposerValue: (value: string) => void;
  /** Load picked files entirely client-side (object URLs, no upload) and stage them. */
  addAttachments: (files: FileList | File[]) => void;
  removeAttachment: (id: string) => void;
  setSearchQuery: (value: string) => void;
  // conversation actions
  selectThread: (id: string) => void;
  createThread: () => void;
  pinThread: (id: string) => void;
  selectModel: (id: ProviderTab, subModel?: string) => void;
  selectAgent: (id: string) => void;
  sendMessage: (text: string) => void;
  /** Edit a sent user message in place, then regenerate a fresh assistant reply. */
  editMessage: (messageId: string, content: string) => void;
  stopStreaming: () => void;
  /** Instantly swap an assistant message to its alternative predefined variant. */
  swapVariant: (messageId: string) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Mirror committed state for use inside async callbacks / event handlers
  // without stale closures. Synced after commit (never written during render).
  const stateRef = useRef<AppState>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const abortRef = useRef<AbortController | null>(null);

  const activeThread = selectActiveThread(state);
  const activeModel = getModel(activeThread.modelId);
  const activeAgent = getAgent(activeThread.agentId);
  const activeSubModel = activeThread.subModel ?? recommendedSubModel(activeThread.modelId);
  const isStreaming = state.streamingMessageId !== null;

  const setSidebarOpen = useCallback((open: boolean) => dispatch({ type: "SET_SIDEBAR", open }), []);
  const setAgentDrawerOpen = useCallback((open: boolean) => dispatch({ type: "SET_AGENT_DRAWER", open }), []);
  const setComposerValue = useCallback((value: string) => dispatch({ type: "SET_COMPOSER_VALUE", value }), []);
  const setSearchQuery = useCallback((value: string) => dispatch({ type: "SET_SEARCH", value }), []);
  const selectThread = useCallback((id: string) => dispatch({ type: "SELECT_THREAD", id }), []);
  const pinThread = useCallback((id: string) => dispatch({ type: "PIN_THREAD", id }), []);

  const createThread = useCallback(() => {
    const thread: Thread = {
      id: uid("t"),
      title: "New Chat",
      agentId: DEFAULT_AGENT_ID,
      modelId: DEFAULT_MODEL_ID,
      pinned: false,
      messages: [],
      updatedAt: Date.now(),
    };
    dispatch({ type: "CREATE_THREAD", thread });
  }, []);

  // Files are turned into object URLs in the browser — no upload, no backend.
  const addAttachments = useCallback((files: FileList | File[]) => {
    const attachments: Attachment[] = Array.from(files).map((file) => ({
      id: uid("f"),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    if (attachments.length) dispatch({ type: "ADD_ATTACHMENTS", attachments });
  }, []);

  const removeAttachment = useCallback((id: string) => {
    const target = stateRef.current.composerAttachments.find((a) => a.id === id);
    if (target) URL.revokeObjectURL(target.url);
    dispatch({ type: "REMOVE_ATTACHMENT", id });
  }, []);

  const selectModel = useCallback((id: ProviderTab, subModel?: string) => {
    dispatch({
      type: "SET_MODEL",
      threadId: stateRef.current.activeThreadId,
      modelId: id,
      subModel: subModel ?? recommendedSubModel(id),
    });
  }, []);

  const selectAgent = useCallback((id: string) => {
    const agent = getAgent(id);
    dispatch({
      type: "SET_AGENT",
      threadId: stateRef.current.activeThreadId,
      agentId: id,
      modelId: agent.defaultModel,
      subModel: recommendedSubModel(agent.defaultModel),
    });
  }, []);

  const stopStreaming = useCallback(() => abortRef.current?.abort(), []);

  const swapVariant = useCallback((messageId: string) => {
    dispatch({ type: "SWAP_VARIANT", threadId: stateRef.current.activeThreadId, messageId });
  }, []);

  // Appends a streaming assistant message and consumes the mock provider's
  // chunk stream into it. Shared by both first-send and edit-and-regenerate.
  const streamTurn = useCallback((thread: Thread, history: Message[]) => {
    const threadId = thread.id;
    const assistantId = uid("m");
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      steps: [],
      modelId: thread.modelId,
      agentId: thread.agentId,
      streaming: true,
      createdAt: Date.now(),
    };

    dispatch({ type: "APPEND_MESSAGE", threadId, message: assistantMessage });
    dispatch({ type: "START_STREAM", messageId: assistantId });

    const controller = new AbortController();
    abortRef.current = controller;

    void (async () => {
      try {
        const stream = mockProvider.sendMessage(history, {
          modelId: thread.modelId,
          agentId: thread.agentId,
          signal: controller.signal,
        });
        for await (const chunk of stream) {
          if (chunk.type === "reasoning_step") {
            dispatch({
              type: "ADD_STEP",
              threadId,
              messageId: assistantId,
              step: { id: chunk.id, label: chunk.label, status: "running" },
            });
          } else if (chunk.type === "retry_variant") {
            dispatch({ type: "SET_RETRY_VARIANT", threadId, messageId: assistantId, content: chunk.content });
          } else {
            dispatch({ type: "APPEND_DELTA", threadId, messageId: assistantId, content: chunk.content });
          }
        }
      } finally {
        dispatch({ type: "END_STREAM", threadId, messageId: assistantId });
        if (abortRef.current === controller) abortRef.current = null;
      }
    })();
  }, []);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    const attachments = stateRef.current.composerAttachments;
    // Send when there is text OR at least one attached file (ChatGPT-style).
    if ((!trimmed && attachments.length === 0) || stateRef.current.streamingMessageId) return;

    const thread = selectActiveThread(stateRef.current);
    const userMessage: Message = {
      id: uid("m"),
      role: "user",
      content: trimmed,
      ...(attachments.length ? { attachments } : {}),
      createdAt: Date.now(),
    };

    dispatch({ type: "APPEND_MESSAGE", threadId: thread.id, message: userMessage });
    dispatch({ type: "SET_COMPOSER_VALUE", value: "" });
    dispatch({ type: "CLEAR_ATTACHMENTS" });
    streamTurn(thread, [...thread.messages, userMessage]);
  }, [streamTurn]);

  // Edit a previously-sent user message in place, then regenerate a reply. The
  // new answer is appended (the app never branches history — see docs/handoff.md).
  const editMessage = useCallback((messageId: string, content: string) => {
    const trimmed = content.trim();
    if (!trimmed || stateRef.current.streamingMessageId) return;

    const thread = selectActiveThread(stateRef.current);
    const index = thread.messages.findIndex((m) => m.id === messageId);
    if (index === -1 || thread.messages[index].role !== "user") return;

    dispatch({ type: "EDIT_MESSAGE", threadId: thread.id, messageId, content: trimmed });
    const edited: Message = { ...thread.messages[index], content: trimmed };
    const history = [...thread.messages.slice(0, index), edited];
    streamTurn(thread, history);
  }, [streamTurn]);

  const value = useMemo<AppContextValue>(
    () => ({
      models: MODELS,
      agents: AGENTS,
      threads: state.threads,
      activeThread,
      activeThreadId: state.activeThreadId,
      activeModel,
      activeAgent,
      activeSubModel,
      sidebarOpen: state.sidebarOpen,
      agentDrawerOpen: state.agentDrawerOpen,
      composerValue: state.composerValue,
      composerAttachments: state.composerAttachments,
      searchQuery: state.searchQuery,
      isStreaming,
      setSidebarOpen,
      setAgentDrawerOpen,
      setComposerValue,
      addAttachments,
      removeAttachment,
      setSearchQuery,
      selectThread,
      createThread,
      pinThread,
      selectModel,
      selectAgent,
      sendMessage,
      editMessage,
      stopStreaming,
      swapVariant,
    }),
    [
      state.threads,
      state.activeThreadId,
      state.sidebarOpen,
      state.agentDrawerOpen,
      state.composerValue,
      state.composerAttachments,
      state.searchQuery,
      activeThread,
      activeModel,
      activeAgent,
      activeSubModel,
      isStreaming,
      setSidebarOpen,
      setAgentDrawerOpen,
      setComposerValue,
      addAttachments,
      removeAttachment,
      setSearchQuery,
      selectThread,
      createThread,
      pinThread,
      selectModel,
      selectAgent,
      sendMessage,
      editMessage,
      stopStreaming,
      swapVariant,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
