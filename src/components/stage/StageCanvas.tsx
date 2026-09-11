"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace, type WebGLRenderer } from "three";
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
  const dpr = useMemo<[number, number]>(() => [1, dprMax], [dprMax]);

  useEffect(() => {
    const node = host.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.08, rootMargin: "40px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
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
          shadows
          dpr={dpr}
          gl={{
            antialias: true,
            alpha,
            powerPreference: "high-performance",
            stencil: false,
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
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      ) : null}
    </div>
  );
}
