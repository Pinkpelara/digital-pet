"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace, type WebGLRenderer } from "three";
import { useBudgetGpu } from "@/components/site/use-budget-gpu";
import { StageBudgetContext } from "@/components/stage/stage-budget";
import { STAGE_BG } from "@/lib/stage-theme";

type StageCanvasProps = {
  children: ReactNode;
  className?: string;
  camera?: { position: [number, number, number]; fov?: number; near?: number; far?: number };
  alpha?: boolean;
  dprMax?: number;
  onPointerMove?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
  onClick?: (event: PointerEvent<HTMLDivElement>) => void;
};

export function StageCanvas({
  children,
  className,
  camera = { position: [0, 0.45, 5.6], fov: 30 },
  alpha = true,
  dprMax = 1.6,
  onPointerMove,
  onPointerDown,
  onClick,
}: StageCanvasProps) {
  const host = useRef<HTMLDivElement>(null);
  const renderer = useRef<WebGLRenderer | null>(null);
  const [visible, setVisible] = useState(false);
  const [tabOn, setTabOn] = useState(true);
  const budget = useBudgetGpu();
  const cap = budget ? Math.min(dprMax, 1.15) : dprMax;
  const dpr = useMemo<[number, number]>(() => [1, cap], [cap]);

  useEffect(() => {
    const node = host.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05, rootMargin: "80px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setTabOn(document.visibilityState !== "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    return () => {
      const gl = renderer.current;
      if (!gl) return;
      gl.getContext().getExtension("WEBGL_lose_context")?.loseContext();
      gl.dispose();
      renderer.current = null;
    };
  }, [visible]);

  return (
    <div
      ref={host}
      className={className}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onClick={onClick}
      style={alpha ? undefined : { background: STAGE_BG }}
    >
      {visible ? (
        <Canvas
          shadows={!budget}
          dpr={dpr}
          frameloop={tabOn ? "always" : "never"}
          gl={{
            antialias: !budget,
            alpha,
            powerPreference: budget ? "low-power" : "high-performance",
            stencil: false,
            depth: true,
          }}
          onCreated={({ gl }) => {
            renderer.current = gl;
            gl.toneMapping = ACESFilmicToneMapping;
            gl.outputColorSpace = SRGBColorSpace;
          }}
          camera={{
            position: camera.position,
            fov: camera.fov ?? 30,
            near: camera.near ?? 0.1,
            far: camera.far ?? 40,
          }}
        >
          <StageBudgetContext.Provider value={{ budget }}>
            <Suspense fallback={null}>{children}</Suspense>
          </StageBudgetContext.Provider>
        </Canvas>
      ) : null}
    </div>
  );
}
