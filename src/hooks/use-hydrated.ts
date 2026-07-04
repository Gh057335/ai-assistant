"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

// True only after client hydration. Gate any Date.now()/new Date() render
// output behind this — the app is statically prerendered, so reading the
// clock during render would mismatch the server HTML. (This project's ESLint
// bans the useState+useEffect "mounted" pattern; useSyncExternalStore is the
// sanctioned fix.)
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
