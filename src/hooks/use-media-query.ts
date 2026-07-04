"use client";

import { useEffect, useState } from "react";

// Reactive CSS media-query match. Returns false on the server / first render
// (matchMedia is client-only) then syncs after mount, so it's safe in the
// statically-prerendered app as long as callers don't branch layout during the
// initial paint of prerendered content. Used to switch the topbar popup between
// a centered desktop modal and a mobile bottom-sheet.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
