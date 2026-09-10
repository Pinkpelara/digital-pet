"use client";

import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
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
  placement?: "center" | "stage-right";
};

function Aim({
  pointer,
  placement,
  cameraZ,
}: {
  pointer: { x: number; y: number };
  placement: "center" | "stage-right";
  cameraZ: number;
}) {
  useFrame((state) => {
    const cam = state.camera;
    const baseX = placement === "stage-right" ? 0.42 : 0;
    const lookX = placement === "stage-right" ? 0.7 : 0;
    cam.position.x = MathUtils.lerp(cam.position.x, baseX + pointer.x * 0.35, 0.05);
    cam.position.y = MathUtils.lerp(cam.position.y, 0.42 + pointer.y * -0.14, 0.05);
    cam.position.z = MathUtils.lerp(cam.position.z, cameraZ, 0.05);
    cam.lookAt(lookX, 0.16, 0);
  });
  return null;
}

export function CreatureStage({
  species,
  equipped,
  mood = "idle",
  skill = null,
  className,
  followPointer = true,
  cameraZ = 5.7,
  placement = "center",
}: CreatureStageProps) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [press, setPress] = useState(0);
  const figureX = placement === "stage-right" ? 0.82 : 0;

  return (
    <StageCanvas
      className={className}
      alpha={false}
      camera={{ position: [placement === "stage-right" ? 0.42 : 0, 0.42, cameraZ], fov: 30 }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        setPointer({ x, y });
      }}
      onPointerDown={() => setPress(1)}
      onPointerUp={() => setPress(0)}
    >
      <color attach="background" args={["#070809"]} />
      <fog attach="fog" args={["#070809", 8, 16]} />
      <StudioLights intensity={0.95} />
      <StudioSill width={placement === "stage-right" ? 10 : 6.5} />
      <Aim pointer={pointer} placement={placement} cameraZ={cameraZ} />
      <group position={[figureX, 0.12, 0]} scale={placement === "stage-right" ? 1.16 : 1.08}>
        <FigurineMesh
          species={species}
          equipped={equipped}
          mood={mood}
          skill={skill}
          followPointer={followPointer}
          pointer={pointer}
          press={press}
        />
      </group>
      <StudioShadows scale={placement === "stage-right" ? 12 : 10} />
    </StageCanvas>
  );
}
