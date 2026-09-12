"use client";

import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { FigurineMesh } from "@/components/stage/FigurineMesh";
import { StudioLights } from "@/components/stage/StudioKit";
import type { DemoActionId, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

/**
 * One WebGL canvas for the whole page. Every product poster tracks its own
 * rectangle and renders into it — so a shop full of gadgets stays smooth and
 * nothing ever shows up as an empty box.
 */
export function ShowreelCanvas({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-20">
        <Canvas
          gl={{ alpha: true, antialias: true, stencil: false, depth: true }}
          dpr={[1, 2]}
          frameloop="always"
          camera={{ position: [0, 0.3, 5.4], fov: 32, near: 0.1, far: 30 }}
        >
          <View.Port />
        </Canvas>
      </div>
    </>
  );
}

export function ShowreelSlot({
  species,
  equipped = {},
  demo = null,
  skill = null,
  className,
}: {
  species: SpeciesId;
  equipped?: EquipmentLoadout;
  demo?: DemoActionId | null;
  skill?: SkillId | null;
  className?: string;
}) {
  return (
    <View className={className}>
      <StudioLights intensity={1.05} />
      <FigurineMesh species={species} equipped={equipped} demo={demo} skill={skill} quality="medium" loop />
    </View>
  );
}
