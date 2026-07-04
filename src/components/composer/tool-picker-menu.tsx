"use client";

import { BarChart3, Globe, Image as ImageIcon, Paperclip, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tool, ToolAction, ToolIcon } from "@/lib/mock/tools";

// Keyed name → lucide icon (same pattern as quick-actions). Exported so the
// composer's active-mode pill renders the identical glyph.
export const TOOL_ICONS: Record<ToolIcon, LucideIcon> = {
  paperclip: Paperclip,
  image: ImageIcon,
  globe: Globe,
  "bar-chart": BarChart3,
};

interface ToolPickerMenuProps {
  /** Tools to list — configurable; defaults live in lib/mock/tools.ts. */
  tools: Tool[];
  /** Controlled by the parent (the composer's `+` button + useDropdown). */
  isOpen: boolean;
  /** Real-time filter, driven by the main input's current value. */
  filter?: string;
  /** Fires with the chosen tool's action; the parent applies the mode + closes. */
  onSelect: (action: ToolAction) => void;
}

// Glassmorphism dropdown that opens ABOVE the input bar. Presentational +
// controlled: open/close (click-outside, Escape) and filtering are owned by the
// parent; this component only renders, animates in, and reports selections.
// The enter animation is a pure CSS keyframe (fade-in + slide-up, 100ms) — no
// motion lib — that plays on mount and collapses to instant under
// prefers-reduced-motion (see globals.css).
export function ToolPickerMenu({ tools, isOpen, filter = "", onSelect }: ToolPickerMenuProps) {
  if (!isOpen) return null;

  const q = filter.trim().toLowerCase();
  const visible = q
    ? tools.filter(
        (t) =>
          t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
      )
    : tools;

  return (
    <div
      role="menu"
      aria-label="Strumenti"
      className={cn(
        "tool-picker-enter absolute bottom-full left-0 z-30 mb-2 w-80 max-w-[calc(100vw-2rem)]",
        "overflow-hidden rounded-xl border border-white/10 bg-[var(--bg-secondary)]/80 shadow-xl backdrop-blur-xl",
      )}
    >
      <ul className="p-1">
        {visible.map((tool) => {
          const Icon = TOOL_ICONS[tool.icon];
          return (
          <li key={tool.action}>
            <button
              type="button"
              role="menuitem"
              onClick={() => onSelect(tool.action)}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <Icon className="size-4 shrink-0 text-[var(--text-secondary)]" aria-hidden />
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold text-[var(--text-primary)]">
                  {tool.label}
                </span>
                <span className="block truncate text-[12px] text-[var(--text-secondary)]">
                  {tool.description}
                </span>
              </span>
            </button>
          </li>
          );
        })}
        {visible.length === 0 && (
          <li className="px-2.5 py-3 text-center text-[12px] text-[var(--text-muted)]">
            Nessuno strumento trovato
          </li>
        )}
      </ul>

      <div className="border-t border-white/10 px-3 py-2 text-[11px] text-[var(--text-muted)]">
        Digita per cercare plugin, file e skill
      </div>
    </div>
  );
}
