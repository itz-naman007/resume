"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Clipboard copy with a self-resetting "copied" state for micro-feedback. */
export function useCopy(resetAfter = 2000) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copy = useCallback(
    async (text: string) => {
      setError("");
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetAfter);
      } catch {
        setError("Copy unavailable. Select the email address or use the Email link below.");
      }
    },
    [resetAfter],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return { copied, copy, error };
}
