"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { ActionWheel } from "@/components/stage/ActionWheel";
import { LiveStage } from "@/components/stage/LiveStage";
import { StageFx } from "@/components/stage/StageFx";
import { usePlayableCompanion } from "@/components/stage/use-playable-companion";
import type { CreatureStageProps } from "@/components/stage/CreatureStage";
import { actionFromLoadout } from "@/lib/demo-actions";
import type { DemoActionId, SkillId } from "@/lib/types";

type PlayableStageProps = Omit<CreatureStageProps, "onStageClick" | "demo" | "sulk"> & {
  unlockedSkills?: SkillId[];
  companionName?: string;
  hint?: string;
  autoPlay?: DemoActionId | null;
  playAction?: DemoActionId | null;
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
  ...stage
}: PlayableStageProps) {
  const drag = useRef<{ x: number; y: number } | null>(null);
  const playable = usePlayableCompanion({ species, equipped, unlockedSkills });
  const lastExternal = useRef<DemoActionId | null>(null);
  const hintText = hint ?? (playable.open ? "" : playable.sulk ? playable.caption : "Tap them for tricks.");

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

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    drag.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const origin = drag.current;
    drag.current = null;
    if (!origin) return;
    const moved = Math.hypot(event.clientX - origin.x, event.clientY - origin.y);
    if (moved > 10) return;
    const target = event.target as HTMLElement;
    if (target.closest(".action-wheel-slot") || target.closest(".action-wheel-scrim")) return;
    playable.toggleWheel();
  }

  const liveDemo =
    playAction ??
    stage.skill ??
    actionFromLoadout(playable.equipped, null, null) ??
    playable.demo ??
    autoPlay ??
    null;

  return (
    <div
      className={`playable-stage relative h-full w-full ${className ?? ""}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <LiveStage
        {...stage}
        species={species}
        equipped={playable.equipped}
        mood={playable.mood}
        skill={playable.skill ?? stage.skill}
        demo={liveDemo}
        sulk={playable.sulk}
        className="h-full w-full"
      />
      <StageFx demo={liveDemo} />
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
