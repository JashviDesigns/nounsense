"use client";

import { useEffect, useState } from "react";

/** Matches reference splash: board stickies → NounSense title (~6s). */
const DEFAULT_MIN_MS = 6000;

/** Keeps the loader visible for at least `minMs` on each mount. */
export function useEntranceReady(ready: boolean, minMs = DEFAULT_MIN_MS): boolean {
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    setMinElapsed(false);
    const t = setTimeout(() => setMinElapsed(true), minMs);
    return () => clearTimeout(t);
  }, [minMs]);

  return ready && minElapsed;
}
