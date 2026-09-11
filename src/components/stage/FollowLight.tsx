"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { PointLight } from "three";
import { MathUtils } from "three";

/** Magenta key that tracks the pointer — cinematic, not a second canvas. */
export function FollowLight({
  pointer,
  color = "#FF5AA8",
  intensity = 1.15,
}: {
  pointer: { x: number; y: number };
  color?: string;
  intensity?: number;
}) {
  const light = useRef<PointLight>(null);
  useFrame(() => {
    const node = light.current;
    if (!node) return;
    node.position.x = MathUtils.lerp(node.position.x, pointer.x * 2.4, 0.08);
    node.position.y = MathUtils.lerp(node.position.y, 1.15 + pointer.y * -0.7, 0.08);
    node.position.z = MathUtils.lerp(node.position.z, 2.1 + pointer.x * 0.2, 0.08);
  });
  return <pointLight ref={light} color={color} intensity={intensity} distance={10} decay={2} position={[0, 1.2, 2]} />;
}
