"use client";

import { useEffect, useRef, useState } from "react";
import { Creature } from "@/components/creatures/Creature";
import { stepActor, type ActorState } from "@/components/creatures/behavior";
import type { EquipmentLoadout, PersonalityStats, SpeciesId } from "@/lib/types";

type RoamingCreatureProps = {
  species: SpeciesId;
  stats: PersonalityStats;
  equipped?: EquipmentLoadout;
  start: { x: number; y: number };
  size?: number;
  paused?: boolean;
  reducedMotion?: boolean;
  followPointer?: boolean;
  className?: string;
  mishap?: boolean;
};

export function RoamingCreature({
  species,
  stats,
  equipped,
  start,
  size = 92,
  paused = false,
  reducedMotion = false,
  followPointer = false,
  className,
  mishap = false,
}: RoamingCreatureProps) {
  const [actor, setActor] = useState<ActorState>({
    x: start.x,
    y: start.y,
    vx: 0,
    facing: 1,
    mood: followPointer ? "follow" : "idle",
    skill: null,
    until: 0,
    lookX: null,
    lookY: null,
  });
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef<number>(0);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const tick = (now: number) => {
      setActor((prev) =>
        stepActor(prev, {
          now,
          width: window.innerWidth,
          height: window.innerHeight,
          pointer: followPointer || prev.mood === "follow" ? pointer.current : null,
          stats,
          paused: Boolean(paused),
          reducedMotion: Boolean(reducedMotion),
          species,
        }),
      );
      frame.current = window.requestAnimationFrame(tick);
    };
    frame.current = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame.current);
  }, [followPointer, paused, reducedMotion, species, stats]);

  return (
    <div
      className={["pointer-events-none fixed z-30 origin-bottom", mishap ? "creature-mishap" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        left: actor.x,
        top: actor.y,
        transform: `scaleX(${actor.facing})`,
      }}
    >
      <Creature
        species={species}
        size={size}
        equipped={equipped}
        mood={actor.mood}
        looking={actor.lookX != null && actor.lookY != null ? { x: actor.lookX, y: actor.lookY } : null}
        reducedMotion={reducedMotion || paused}
        decorative
      />
    </div>
  );
}
