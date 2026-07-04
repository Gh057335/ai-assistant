"use client";

import { useContext } from "react";
import { AppContext, type AppContextValue } from "@/components/providers/app-provider";

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
}
