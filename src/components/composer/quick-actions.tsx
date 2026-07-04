"use client";

import {
  BarChart3,
  BookOpen,
  CheckCircle,
  Cloud,
  Code,
  FileText,
  GitCompare,
  Lightbulb,
  Pencil,
  Search,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { quickActionsFor, type QuickActionIcon } from "@/lib/mock/quick-actions";

const ICONS: Record<QuickActionIcon, LucideIcon> = {
  cloud: Cloud,
  code: Code,
  pencil: Pencil,
  "bar-chart-3": BarChart3,
  lightbulb: Lightbulb,
  search: Search,
  "file-text": FileText,
  "git-compare": GitCompare,
  "check-circle": CheckCircle,
  "book-open": BookOpen,
};

// Contextual suggestion chips under the composer; the set changes with the
// active model. Clicking one seeds the composer prompt.
export function QuickActions() {
  const { activeModel, setComposerValue } = useApp();
  const actions = quickActionsFor(activeModel.id);

  return (
    <div className="flex flex-wrap justify-center gap-2 pt-3">
      {actions.map((action) => {
        const Icon = ICONS[action.icon];
        return (
          <button
            key={action.label}
            type="button"
            onClick={() => setComposerValue(action.prompt)}
            className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <Icon className="size-3.5" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
