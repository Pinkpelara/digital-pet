"use client";

import dynamic from "next/dynamic";
import type { CreatureStageProps } from "@/components/stage/CreatureStage";
import { Creature } from "@/components/creatures/Creature";
import { WhenVisible } from "@/components/site/WhenVisible";

const LoadedStage = dynamic(
  () => import("@/components/stage/CreatureStage").then((mod) => mod.CreatureStage),
  { ssr: false, loading: () => <div className="h-full w-full bg-cream" /> },
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
  return (
    <WhenVisible
      className={props.className}
      fallback={<div className="h-full min-h-[160px] w-full bg-cream" />}
    >
      <LoadedStage {...props} />
    </WhenVisible>
  );
}
