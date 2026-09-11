"use client";

import { FigurineMesh } from "@/components/stage/FigurineMesh";
import { StageCanvas } from "@/components/stage/StageCanvas";
import { StudioLights, StudioShadows, StudioSill } from "@/components/stage/StudioKit";
import { useBudgetGpu } from "@/components/site/use-budget-gpu";
import { STAGE_BG, STAGE_FOG } from "@/lib/stage-theme";
import type { CreatureMood, DemoActionId, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

export type PairedFigure = {
  species: SpeciesId;
  equipped?: EquipmentLoadout;
  mood?: CreatureMood;
  skill?: SkillId | null;
  demo?: DemoActionId | null;
};

export function PairedCreatureStage({
  left,
  right,
  className,
}: {
  left: PairedFigure;
  right: PairedFigure;
  className?: string;
}) {
  const budget = useBudgetGpu();
  const meshQuality = budget ? "low" : "medium";
  return (
    <StageCanvas
      className={className}
      alpha={false}
      dprMax={1.2}
      camera={{ position: [0, 0.55, 7.4], fov: 28, far: 40 }}
    >
      <color attach="background" args={[STAGE_BG]} />
      <fog attach="fog" args={[STAGE_FOG, 16, 30]} />
      <StudioLights intensity={0.92} />
      <StudioSill width={9.4} position={[0, -1.08, 0.16]} />
      <group position={[-1.7, 0.04, 0]}>
        <FigurineMesh
          species={left.species}
          equipped={left.equipped}
          mood={left.mood ?? "idle"}
          skill={left.skill ?? null}
          demo={left.demo ?? null}
          followPointer={false}
          quality={meshQuality}
        />
      </group>
      <group position={[1.7, 0.04, 0]}>
        <FigurineMesh
          species={right.species}
          equipped={right.equipped}
          mood={right.mood ?? "idle"}
          skill={right.skill ?? null}
          demo={right.demo ?? null}
          followPointer={false}
          quality={meshQuality}
        />
      </group>
      <StudioShadows scale={14} />
    </StageCanvas>
  );
}
