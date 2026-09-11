"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { MathUtils } from "three";
import { FigurineMesh } from "@/components/stage/FigurineMesh";
import { StageCanvas } from "@/components/stage/StageCanvas";
import { StudioLights, StudioShadows, StudioSill } from "@/components/stage/StudioKit";
import { STAGE_BG, STAGE_FOG } from "@/lib/stage-theme";
import type { SpeciesId } from "@/lib/types";

const lineup: SpeciesId[] = ["bloop", "mochi", "sprout", "niblet"];

function Lineup({ pointer }: { pointer: { x: number; y: number } }) {
  const group = useRef<Group>(null);
  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, pointer.x * 0.16, 0.05);
    group.current.position.x = MathUtils.lerp(group.current.position.x, pointer.x * -0.35, 0.05);
  });
  return (
    <group ref={group} position={[0, 0.06, 0]}>
      {lineup.map((species, index) => (
        <group key={species} position={[(index - 1.5) * 1.9, 0, 0]}>
          <FigurineMesh species={species} quality="low" followPointer={false} />
        </group>
      ))}
    </group>
  );
}

export function ResidentSill({ className = "h-full w-full" }: { className?: string }) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  return (
    <StageCanvas
      className={className}
      alpha={false}
      dprMax={1.25}
      camera={{ position: [0, 0.85, 8.6], fov: 28, far: 40 }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        setPointer({ x, y });
      }}
    >
      <color attach="background" args={[STAGE_BG]} />
      <fog attach="fog" args={[STAGE_FOG, 16, 32]} />
      <StudioLights intensity={1.05} />
      <StudioSill width={10} position={[0, -1.1, 0.2]} />
      <Lineup pointer={pointer} />
      <StudioShadows position={[0, -0.96, 0]} scale={14} />
    </StageCanvas>
  );
}
