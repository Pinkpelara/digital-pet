"use client";

import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { FigurineMesh } from "@/components/stage/FigurineMesh";
import type { CreatureMood, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

export type CreatureStageProps = {
  species: SpeciesId;
  equipped?: EquipmentLoadout;
  mood?: CreatureMood;
  skill?: SkillId | null;
  className?: string;
  followPointer?: boolean;
  cameraZ?: number;
  autoRotate?: boolean;
};

function Lights() {
  return (
    <>
      <hemisphereLight args={["#d7ddd8", "#1a1c1b", 0.55]} />
      <directionalLight
        castShadow
        position={[2.8, 4.2, 2.4]}
        intensity={2.15}
        color="#f3f1ea"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={12}
        shadow-camera-near={0.4}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />
      <directionalLight position={[-3.2, 1.4, -2.2]} intensity={1.35} color="#8aa0aa" />
      <pointLight position={[0, -0.6, 2.2]} intensity={0.45} color="#c5c2b8" />
    </>
  );
}

export function CreatureStage({
  species,
  equipped,
  mood = "idle",
  skill = null,
  className,
  followPointer = true,
  cameraZ = 3.6,
}: CreatureStageProps) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const dpr = useMemo<[number, number]>(() => [1, 1.6], []);

  return (
    <div
      className={className}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        setPointer({ x, y });
      }}
    >
      <Canvas
        shadows
        dpr={dpr}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.35, cameraZ], fov: 28, near: 0.1, far: 30 }}
      >
        <Suspense fallback={null}>
          <Lights />
          <FigurineMesh
            species={species}
            equipped={equipped}
            mood={mood}
            skill={skill}
            followPointer={followPointer}
            pointer={pointer}
          />
          <ContactShadows position={[0, -1.05, 0]} opacity={0.45} scale={8} blur={2.4} far={2.8} color="#050605" />
        </Suspense>
      </Canvas>
    </div>
  );
}
