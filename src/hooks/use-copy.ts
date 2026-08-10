"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Clipboard copy with a self-resetting "copied" state for micro-feedback. */
export function useCopy(resetAfter = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetAfter);
      } catch {
        // Clipboard unavailable (e.g. insecure context) — fail silently.
      }
    },
    [resetAfter],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return { copied, copy };
}
