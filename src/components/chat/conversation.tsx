"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/hooks/use-app";
import { Message } from "./message";
import { EmptyState } from "./empty-state";

// Scrollable message column, max-width 720px centered. Auto-scrolls to the
// latest content while streaming. Retry instantly swaps the assistant answer to
// its predefined alternative variant — no re-run, no new request.
export function Conversation() {
  const { activeThread, isStreaming, swapVariant, editMessage } = useApp();
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = activeThread.messages;
  const lastContent = messages[messages.length - 1]?.content ?? "";
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "end",
    });
  }, [messages.length, lastContent, prefersReducedMotion]);

  if (messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hidden">
      <div className="mx-auto flex max-w-[720px] flex-col gap-6 px-4 py-6">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            onRetry={
              message.role === "assistant" && message.retryContent !== undefined
                ? () => swapVariant(message.id)
                : undefined
            }
            canRetry={!isStreaming}
            onEdit={
              message.role === "user"
                ? (content) => editMessage(message.id, content)
                : undefined
            }
            canEdit={!isStreaming}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
