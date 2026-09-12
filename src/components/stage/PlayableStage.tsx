"use client";

import { useEffect, useRef } from "react";
import { LiveStage } from "@/components/stage/LiveStage";
import { StageFx } from "@/components/stage/StageFx";
import { usePlayableCompanion } from "@/components/stage/use-playable-companion";
import type { CreatureStageProps } from "@/components/stage/CreatureStage";
import type { BehaviourCounters, DemoActionId, PersonalitySeed, PersonalityStats, SkillId } from "@/lib/types";

type PlayableStageProps = Omit<CreatureStageProps, "onStageClick" | "demo"> & {
  unlockedSkills?: SkillId[];
  companionName?: string;
  hint?: string;
  autoPlay?: DemoActionId | null;
  playAction?: DemoActionId | null;
  /** This individual's hidden personality. Drives what they do on their own. */
  stats?: PersonalityStats;
  /** Called when they are observed doing something. Feeds trait discovery. */
  onBehaviour?: (kind: keyof BehaviourCounters) => void;
  instanceId?: string;
  seed?: PersonalitySeed;
  persistEquip?: boolean;
  holdAction?: DemoActionId | null;
};

export function PlayableStage({
  unlockedSkills,
  companionName = "them",
  hint,
  autoPlay = null,
  playAction = null,
  stats,
  onBehaviour,
  instanceId,
  seed,
  persistEquip,
  holdAction,
  equipped,
  species,
  className,
  ...stage
}: PlayableStageProps) {
  const playable = usePlayableCompanion({
    species,
    equipped,
    unlockedSkills,
    stats,
    onBehaviour,
    instanceId,
    seed,
    persistEquip,
    holdAction,
  });
  const lastExternal = useRef<DemoActionId | null>(null);

  const applyExternal = playable.applyExternal;
  const playedAuto = useRef(false);

  useEffect(() => {
    if (!autoPlay || playedAuto.current) return;
    playedAuto.current = true;
    applyExternal(autoPlay);
  }, [applyExternal, autoPlay]);

  useEffect(() => {
    const action = playAction ?? stage.skill;
    if (action && action !== lastExternal.current) {
      lastExternal.current = action;
      applyExternal(action);
    }
    if (!playAction && !stage.skill) lastExternal.current = null;
  }, [applyExternal, playAction, stage.skill]);

  const liveDemo = playable.demo ?? playAction ?? stage.skill ?? autoPlay ?? null;
  // Observation-first: they live on their own schedule. Tapping only says hi.
  // Observed moments (trips, hiding spots) flash as captions; otherwise the hint shows.
  const hintText = hint ?? (playable.demo || playable.caption ? "" : "They're doing their own thing. Watch a while.");

  return (
    <div className={`playable-stage relative h-full w-full ${className ?? ""}`}>
      <LiveStage
        {...stage}
        species={species}
        equipped={playable.equipped}
        mood={playable.mood}
        skill={playable.skill ?? stage.skill}
        demo={liveDemo}
        className="h-full w-full"
      />
      <StageFx demo={liveDemo} />
      <button
        type="button"
        className="absolute inset-0 z-[5] cursor-pointer bg-transparent"
        onClick={playable.pat}
        aria-label={`Say hi to ${companionName}`}
      />
      {playable.caption ? (
        <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/80 px-3 py-1 text-xs text-paper">
          {playable.caption}
        </p>
      ) : hintText ? (
        <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-ink/80 px-3 py-1 text-xs text-paper">
          {hintText}
        </p>
      ) : null}
    </div>
  );
}
