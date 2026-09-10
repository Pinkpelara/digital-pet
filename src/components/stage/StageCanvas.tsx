"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";

type StageCanvasProps = {
  children: ReactNode;
  className?: string;
  camera?: { position: [number, number, number]; fov?: number; near?: number; far?: number };
  alpha?: boolean;
  dprMax?: number;
  onPointerMove?: (event: PointerEvent<HTMLDivElement>) => void;
};

export function StageCanvas({
  children,
  className,
  camera = { position: [0, 0.45, 5.6], fov: 30 },
  alpha = true,
  dprMax = 1.6,
  onPointerMove,
}: StageCanvasProps) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const dpr = useMemo<[number, number]>(() => [1, dprMax], [dprMax]);

  useEffect(() => {
    const node = host.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio > 0.02),
      { threshold: [0, 0.02, 0.1] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className={className} onPointerMove={onPointerMove}>
      <Canvas
        shadows
        dpr={dpr}
        frameloop={visible ? "always" : "never"}
        gl={{
          antialias: true,
          alpha,
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={({ gl }) => {
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
    </div>
  );
}
