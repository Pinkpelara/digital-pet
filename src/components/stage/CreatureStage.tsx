"use client";

import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import { FigurineMesh } from "@/components/stage/FigurineMesh";
import { StageCanvas } from "@/components/stage/StageCanvas";
import { StudioLights, StudioShadows, StudioSill } from "@/components/stage/StudioKit";
import { useBudgetGpu } from "@/components/site/use-budget-gpu";
import { STAGE_BG, STAGE_FOG } from "@/lib/stage-theme";
import type { CreatureMood, DemoActionId, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

export type CreatureStageProps = {
  species: SpeciesId;
  equipped?: EquipmentLoadout;
  mood?: CreatureMood;
  skill?: SkillId | null;
  demo?: DemoActionId | null;
  sulk?: boolean;
  className?: string;
  followPointer?: boolean;
  cameraZ?: number;
  autoRotate?: boolean;
  placement?: "center" | "stage-right";
  onStageClick?: () => void;
  quality?: "high" | "medium" | "low";
  dprMax?: number;
  loop?: boolean;
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
    cam.position.x = MathUtils.lerp(cam.position.x, baseX + pointer.x * 0.48, 0.06);
    cam.position.y = MathUtils.lerp(cam.position.y, 0.42 + pointer.y * -0.2, 0.06);
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
  demo = null,
  sulk = false,
  className,
  followPointer = true,
  cameraZ = 5.7,
  placement = "center",
  onStageClick,
  quality = "high",
  dprMax,
  loop = false,
}: CreatureStageProps) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const budget = useBudgetGpu();
  const figureX = placement === "stage-right" ? 0.82 : 0;
  const meshQuality = budget ? (quality === "low" ? "low" : "medium") : quality;

  return (
    <StageCanvas
      className={className}
      alpha={false}
      dprMax={dprMax ?? (meshQuality === "high" ? 1.5 : meshQuality === "medium" ? 1.2 : 1.1)}
      camera={{ position: [placement === "stage-right" ? 0.42 : 0, 0.42, cameraZ], fov: 30 }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        setPointer({ x, y });
      }}
      onClick={() => onStageClick?.()}
    >
      <color attach="background" args={[STAGE_BG]} />
      <fog attach="fog" args={[STAGE_FOG, 9, 22]} />
      <StudioLights intensity={1} />
      <StudioSill width={placement === "stage-right" ? 10 : 6.5} />
      <Aim pointer={pointer} placement={placement} cameraZ={cameraZ} />
      <group position={[figureX, 0.04, 0]} scale={placement === "stage-right" ? 1.12 : 1}>
        <FigurineMesh
          species={species}
          equipped={equipped}
          mood={mood}
          skill={skill}
          demo={demo}
          sulk={sulk}
          followPointer={followPointer}
          pointer={pointer}
          quality={meshQuality}
          loop={loop}
        />
      </group>
      <StudioShadows scale={placement === "stage-right" ? 12 : 10} />
    </StageCanvas>
  );
}
