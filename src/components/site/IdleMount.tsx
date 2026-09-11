"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Delay a subtree until after first paint so LCP can be HTML, not WebGL. */
export function IdleMount({
  children,
  delay = 800,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const onReady = () => {
      if (!cancelled) setReady(true);
    };
    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(onReady, { timeout: delay });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }
    const timeoutId = window.setTimeout(onReady, Math.min(delay, 500));
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [delay]);

  if (!ready) return null;
  return <>{children}</>;
}
