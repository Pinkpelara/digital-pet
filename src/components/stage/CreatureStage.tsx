"use client";

import { useState } from "react";
import { FigurineMesh } from "@/components/stage/FigurineMesh";
import { StageCanvas } from "@/components/stage/StageCanvas";
import { StudioLights, StudioShadows, StudioSill } from "@/components/stage/StudioKit";
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

export function CreatureStage({
  species,
  equipped,
  mood = "idle",
  skill = null,
  className,
  followPointer = true,
  cameraZ = 5.55,
}: CreatureStageProps) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  return (
    <StageCanvas
      className={className}
      alpha={false}
      camera={{ position: [0, 0.48, cameraZ], fov: 30 }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        setPointer({ x, y });
      }}
    >
      <color attach="background" args={["#070809"]} />
      <fog attach="fog" args={["#070809", 8, 16]} />
      <StudioLights intensity={0.95} />
      <StudioSill width={6.5} />
      <group position={[0, 0.04, 0]}>
        <FigurineMesh
          species={species}
          equipped={equipped}
          mood={mood}
          skill={skill}
          followPointer={followPointer}
          pointer={pointer}
        />
      </group>
      <StudioShadows />
    </StageCanvas>
  );
}
