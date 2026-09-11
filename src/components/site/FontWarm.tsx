"use client";

import { useEffect } from "react";

/** Apply webfont CSS variables after LCP so they never enter the critical chain. */
export function FontWarm({ className }: { className: string }) {
  useEffect(() => {
    const tokens = className.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return;
    let idleId = 0;
    const apply = () => document.documentElement.classList.add(...tokens);
    const arm = () => {
      idleId = window.setTimeout(apply, 3500);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      window.removeEventListener("load", arm);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleId);
      window.clearTimeout(idleId);
    };
  }, [className]);
  return null;
}
