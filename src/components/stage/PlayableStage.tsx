"use client";

import { useEffect, useRef } from "react";
import { ActionWheel } from "@/components/stage/ActionWheel";
import { LiveStage } from "@/components/stage/LiveStage";
import { StageFx } from "@/components/stage/StageFx";
import { usePlayableCompanion } from "@/components/stage/use-playable-companion";
import type { CreatureStageProps } from "@/components/stage/CreatureStage";
import type { DemoActionId, PersonalitySeed, SkillId } from "@/lib/types";

type PlayableStageProps = Omit<CreatureStageProps, "onStageClick" | "demo" | "sulk"> & {
  unlockedSkills?: SkillId[];
  companionName?: string;
  hint?: string;
  autoPlay?: DemoActionId | null;
  playAction?: DemoActionId | null;
  instanceId?: string;
  seed?: PersonalitySeed;
  persistEquip?: boolean;
};

export function PlayableStage({
  unlockedSkills,
  companionName = "them",
  hint,
  autoPlay = null,
  playAction = null,
  equipped,
  species,
  className,
  instanceId,
  seed,
  persistEquip = false,
  ...stage
}: PlayableStageProps) {
  const playable = usePlayableCompanion({
    species,
    equipped,
    unlockedSkills,
    instanceId,
    seed,
    persistEquip,
    holdAction: playAction ?? autoPlay ?? null,
  });
  const lastExternal = useRef<DemoActionId | null>(null);
  const hintText = hint ?? (playable.open ? "" : "");

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

  return (
    <div className={`playable-stage relative h-full w-full ${className ?? ""}`}>
      <LiveStage
        {...stage}
        species={species}
        equipped={playable.equipped}
        mood={playable.mood}
        skill={playable.skill ?? stage.skill}
        demo={liveDemo}
        sulk={false}
        followPointer={playable.followPointer}
        className="h-full w-full"
      />
      <StageFx demo={liveDemo} />
      <button
        type="button"
        className={`absolute inset-0 z-[5] cursor-pointer bg-transparent ${playable.open ? "pointer-events-none" : ""}`}
        onClick={playable.pat}
        aria-label={`Pat ${companionName}`}
      />
      <button
        type="button"
        className="absolute bottom-4 right-4 z-20 rounded-full bg-ink/80 px-3 py-1 text-xs text-paper"
        onClick={playable.toggleWheel}
        aria-label={`Tricks for ${companionName}`}
        aria-expanded={playable.open}
      >
        Tricks
      </button>
      <ActionWheel
        items={playable.wheel}
        open={playable.open}
        onSelect={playable.play}
        onClose={playable.closeWheel}
        name={companionName}
      />
      {hintText ? (
        <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-ink/80 px-3 py-1 text-xs text-paper">
          {playable.demo ? playable.caption : hintText}
        </p>
      ) : null}
    </div>
  );
}
