"use client";

import { useApp } from "./use-app";
import type { ProviderTab } from "@/types/model.types";

/** Visual identity of the active model: accent (as CSS var) + brand background. */
export function useProviderTheme(): {
  modelId: ProviderTab;
  accent: string;
  background: string;
  style: React.CSSProperties;
} {
  const { activeModel } = useApp();
  return {
    modelId: activeModel.id,
    accent: activeModel.accentColor,
    background: activeModel.background,
    style: { ["--accent" as string]: activeModel.accentColor } as React.CSSProperties,
  };
}
