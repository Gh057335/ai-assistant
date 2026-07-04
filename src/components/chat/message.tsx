"use client";

import { useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Paperclip, Pencil, RotateCcw } from "lucide-react";
import type { Message as MessageType } from "@/types/message.types";
import type { Attachment } from "@/types/attachment.types";
import { getAgent } from "@/lib/mock/agents";
import { getModel } from "@/lib/mock/models";
import { cn, formatBytes } from "@/lib/utils";
import { Markdown } from "./markdown";
import { Timelapse } from "./timelapse";

interface MessageProps {
  message: MessageType;
  onRetry?: () => void;
  canRetry: boolean;
  /** Save an edited user message (updates in place, then regenerates a reply). */
  onEdit?: (content: string) => void;
  canEdit?: boolean;
}

export function Message({ message, onRetry, canRetry, onEdit, canEdit }: MessageProps) {
  if (message.role === "user")
    return <UserMessage message={message} onEdit={onEdit} canEdit={canEdit} />;
  return <AssistantMessage message={message} onRetry={onRetry} canRetry={canRetry} />;
}

function UserMessage({
  message,
  onEdit,
  canEdit,
}: {
  message: MessageType;
  onEdit?: (content: string) => void;
  canEdit?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const attachments = message.attachments ?? [];

  const startEdit = () => {
    setDraft(message.content);
    setEditing(true);
  };
  const save = () => {
    const trimmed = draft.trim();
    setEditing(false);
    if (trimmed && trimmed !== message.content) onEdit?.(trimmed);
  };
  const cancel = () => {
    setDraft(message.content);
    setEditing(false);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  if (editing) {
    return (
      <div className="flex flex-col items-end gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Edit message"
          autoFocus
          rows={Math.min(8, draft.split("\n").length)}
          className="w-[85%] resize-none rounded-2xl border border-[var(--accent)] bg-[var(--bg-user-bubble)] px-3.5 py-2 text-[14px] text-[var(--text-primary)] focus:outline-none scrollbar-hidden"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={cancel}
            className="rounded-lg px-3 py-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Save &amp; send
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col items-end gap-1"
    >
      {attachments.length > 0 && (
        <ul className="flex max-w-[85%] flex-wrap justify-end gap-2">
          {attachments.map((file) => (
            <AttachmentChip key={file.id} file={file} />
          ))}
        </ul>
      )}
      {message.content && (
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-[var(--bg-user-bubble)] px-3.5 py-2 text-[14px] text-[var(--text-primary)]">
          {message.content}
        </div>
      )}
      {onEdit && message.content && (
        <div className="flex opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
          <ActionButton label="Edit" onClick={startEdit} disabled={!canEdit}>
            <Pencil className="size-3.5" />
          </ActionButton>
        </div>
      )}
    </motion.div>
  );
}

// Attached file, opened straight from its client-side object URL (no server).
function AttachmentChip({ file }: { file: Attachment }) {
  return (
    <li>
      <a
        href={file.url}
        target="_blank"
        rel="noreferrer"
        download={file.name}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-user-bubble)] px-2.5 py-1.5 text-[12px] text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <Paperclip className="size-3 shrink-0 text-[var(--text-secondary)]" />
        <span className="max-w-[160px] truncate">{file.name}</span>
        <span className="shrink-0 text-[var(--text-muted)]">{formatBytes(file.size)}</span>
      </a>
    </li>
  );
}

function AssistantMessage({ message, onRetry, canRetry }: MessageProps) {
  const [copied, setCopied] = useState(false);
  const agent = getAgent(message.agentId ?? "");
  const model = getModel(message.modelId ?? "base");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — silently ignore.
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group flex gap-3"
    >
      <span
        className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
        style={{ backgroundColor: agent.color }}
        aria-hidden
      >
        {agent.avatar}
      </span>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[12px] text-[var(--text-secondary)]">
          {agent.name} · {model.name}
        </p>
        {message.content ? (
          // Keyed on the active variant so a retry swap cross-fades the new
          // text in; the key stays constant while streaming (variant is unset),
          // so incremental deltas don't re-animate.
          <motion.div
            key={message.variant ?? "streaming"}
            initial={{ opacity: message.variant ? 0 : 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            <Markdown content={message.content} />
          </motion.div>
        ) : message.steps?.length ? (
          <Timelapse steps={message.steps} />
        ) : (
          <span className="text-[13px] text-[var(--text-muted)]">Thinking…</span>
        )}

        {!message.streaming && message.content && (
          <div className="mt-2 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
            <ActionButton label={copied ? "Copied" : "Copy"} onClick={copy}>
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            </ActionButton>
            {onRetry && (
              <ActionButton label="Retry" onClick={onRetry} disabled={!canRetry}>
                <RotateCcw className="size-3.5" />
              </ActionButton>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "flex items-center gap-1 rounded-md px-1.5 py-1 text-[12px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-40",
      )}
    >
      {children}
      {label}
    </button>
  );
}
