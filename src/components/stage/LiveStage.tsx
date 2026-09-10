"use client";

import dynamic from "next/dynamic";
import type { CreatureStageProps } from "@/components/stage/CreatureStage";
import { Creature } from "@/components/creatures/Creature";

const LoadedStage = dynamic(
  () => import("@/components/stage/CreatureStage").then((mod) => mod.CreatureStage),
  { ssr: false },
);

export function LiveStage(props: CreatureStageProps & { size?: number }) {
  if (props.size && props.size < 90) {
    return (
      <Creature
        species={props.species}
        size={props.size}
        equipped={props.equipped}
        mood={props.mood}
        skill={props.skill}
        decorative
      />
    );
  }
  return <LoadedStage {...props} />;
}
