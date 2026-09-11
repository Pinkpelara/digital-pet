"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { HeroPoster } from "@/components/stage/HeroPoster";

type LivingProps = { onReady?: () => void };

/**
 * First paint: static poster. Three/R3F is imported only after load+idle
 * or the first tap/key — so the poster/headline can be LCP.
 */
export function HeroBackdrop() {
  const [Living, setLiving] = useState<ComponentType<LivingProps> | null>(null);
  const [glReady, setGlReady] = useState(false);
  const loading = useRef(false);

  useEffect(() => {
    let idleId = 0;
    let timeoutId = 0;
    let cancelled = false;

    const load = () => {
      if (cancelled || loading.current) return;
      loading.current = true;
      void import("@/components/stage/HeroLiving").then((mod) => {
        if (!cancelled) setLiving(() => mod.HeroLiving);
      });
    };

    window.addEventListener("pointerdown", load, { once: true, passive: true });
    window.addEventListener("keydown", load, { once: true });
    window.addEventListener("touchstart", load, { once: true, passive: true });

    const armIdle = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(load, { timeout: 1400 });
      } else {
        timeoutId = window.setTimeout(load, 400);
      }
    };

    if (document.readyState === "complete") {
      armIdle();
    } else {
      window.addEventListener("load", armIdle, { once: true });
      timeoutId = window.setTimeout(load, 2800);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("keydown", load);
      window.removeEventListener("touchstart", load);
      window.removeEventListener("load", armIdle);
      if (idleId && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!Living || glReady) return;
    const fallback = window.setTimeout(() => setGlReady(true), 900);
    return () => window.clearTimeout(fallback);
  }, [Living, glReady]);

  return (
    <div className="absolute inset-0">
      <div className={`absolute inset-0 z-[1] ${glReady ? "hero-poster-retired" : ""}`}>
        <HeroPoster />
      </div>
      {Living ? (
        <div className="absolute inset-0 z-[2]">
          <Living onReady={() => setGlReady(true)} />
        </div>
      ) : null}
    </div>
  );
}
