"use client";

import { useApp } from "./use-app";

export function useComposer() {
  const {
    composerValue,
    setComposerValue,
    composerAttachments,
    addAttachments,
    removeAttachment,
    sendMessage,
    stopStreaming,
    isStreaming,
    activeModel,
  } = useApp();

  // Sendable with text OR at least one attached file.
  const canSend =
    (composerValue.trim().length > 0 || composerAttachments.length > 0) && !isStreaming;

  return {
    value: composerValue,
    setValue: setComposerValue,
    attachments: composerAttachments,
    addAttachments,
    removeAttachment,
    placeholder: activeModel.placeholder,
    canSend,
    isStreaming,
    send: () => sendMessage(composerValue),
    stop: stopStreaming,
  };
}
