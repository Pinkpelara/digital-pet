"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Creature } from "@/components/creatures/Creature";
import { stepActor, type ActorState } from "@/components/creatures/behavior";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import { statsFromSeed } from "@/lib/personality";
import type {
  BehaviourCounters,
  CreatureMood,
  EquipmentLoadout,
  PersonalitySeed,
  PersonalityStats,
  SkillId,
  SpeciesId,
} from "@/lib/types";

export type PenActor = {
  key: string;
  species: SpeciesId;
  seed?: PersonalitySeed;
  stats?: PersonalityStats;
  equipped?: EquipmentLoadout;
  size?: number;
  /** Pin a mood so a demo always shows the behaviour being described. */
  mood?: CreatureMood;
  skill?: SkillId | null;
  start?: { x: number; y: number };
  followPointer?: boolean;
};

const NEUTRAL_SEED: PersonalitySeed = {
  id: "neutral",
  values: {
    curiosity: 50,
    courage: 50,
    clinginess: 50,
    sleepiness: 50,
    sociability: 50,
    mischief: 50,
    energy: 50,
    drama: 50,
  },
};

function makeActor(entry: PenActor, box: { w: number; h: number }): ActorState {
  const start = entry.start ?? { x: box.w * 0.3, y: box.h * 0.45 };
  return {
    x: start.x,
    y: start.y,
    vx: 0,
    facing: 1,
    mood: entry.mood ?? "idle",
    skill: entry.skill ?? null,
    until: 0,
    lookX: null,
    lookY: null,
  };
}

function SingleActor({
  entry,
  box,
  pointerRef,
  paused,
  reducedMotion,
  onMood,
}: {
  entry: PenActor;
  box: { w: number; h: number };
  pointerRef: React.MutableRefObject<{ x: number; y: number } | null>;
  paused: boolean;
  reducedMotion: boolean;
  onMood?: (mood: CreatureMood, skill: SkillId | null) => void;
}) {
  const stats = useMemo(
    () => entry.stats ?? statsFromSeed(entry.seed ?? NEUTRAL_SEED),
    [entry.seed, entry.stats],
  );
  const size = entry.size ?? 120;
  const [actor, setActor] = useState<ActorState>(() => makeActor(entry, box));
  const lastMood = useRef<string>("");

  const pinned = Boolean(entry.mood) || Boolean(entry.skill);

  useEffect(() => {
    if (pinned) return;
    let frame = 0;
    const tick = (now: number) => {
      setActor((prev) =>
        stepActor(prev, {
          now,
          width: Math.max(80, box.w - size * 0.35),
          height: Math.max(80, box.h - size * 0.9),
          pointer: pointerRef.current,
          stats,
          paused,
          reducedMotion,
        }),
      );
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [box.h, box.w, entry.mood, entry.skill, paused, pinned, pointerRef, reducedMotion, size, stats]);

  useEffect(() => {
    if (pinned) return;
    const signature = `${actor.mood}:${actor.skill ?? ""}`;
    if (signature === lastMood.current) return;
    lastMood.current = signature;
    onMood?.(actor.mood, actor.skill);
  }, [actor.mood, actor.skill, onMood, pinned]);

  const view = pinned
    ? {
        x: entry.start?.x ?? box.w * 0.3,
        y: entry.start?.y ?? box.h * 0.45,
        facing: 1 as const,
        mood: entry.mood ?? ("happy" as CreatureMood),
        skill: entry.skill ?? null,
        lookX: null,
        lookY: null,
      }
    : actor;

  return (
    <div
      className="absolute bottom-0 left-0 origin-bottom"
      style={{
        transform: `translate3d(${view.x}px, ${view.y}px, 0) scaleX(${view.facing})`,
      }}
    >
      <Creature
        species={entry.species}
        size={size}
        equipped={entry.equipped}
        mood={view.mood}
        skill={view.skill}
        looking={view.lookX != null && view.lookY != null ? { x: view.lookX, y: view.lookY } : null}
        reducedMotion={reducedMotion}
        decorative
      />
    </div>
  );
}

/**
 * A creature living inside a box on the page. Two pens seeded differently
 * visibly behave differently — that is the whole point of the product.
 */
export function LivePen({
  actors,
  className,
  floor = true,
  paused = false,
  onBehaviour,
  label,
  tone = "cream",
}: {
  actors: PenActor[];
  className?: string;
  floor?: boolean;
  paused?: boolean;
  onBehaviour?: (kind: keyof BehaviourCounters, entry: PenActor) => void;
  label?: string;
  tone?: "cream" | "sand" | "mint" | "mist" | "stage";
}) {
  const host = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const [box, setBox] = useState({ w: 320, h: 220 });
  const reducedMotion = useReducedMotion();

  const tones: Record<string, string> = {
    cream: "bg-cream/55",
    sand: "bg-cream-deep/45",
    mint: "bg-moss/10",
    mist: "bg-ink/[0.04]",
    stage: "bg-white/[0.06]",
  };

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const sync = () => {
      const rect = node.getBoundingClientRect();
      setBox({ w: rect.width, h: rect.height });
    };
    sync();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(sync);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (event: PointerEvent) => {
      const rect = host.current?.getBoundingClientRect();
      if (!rect) return;
      pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  return (
    <div
      ref={host}
      className={`relative overflow-hidden rounded-[28px] border border-ink/10 dotted-bg ${tones[tone]} ${
        className ?? ""
      }`}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {floor && (
        <div className="pointer-events-none absolute inset-x-6 bottom-5 h-6 rounded-[50%] bg-ink/10 blur-md" />
      )}
      {actors.map((entry) => (
        <SingleActor
          key={entry.key}
          entry={entry}
          box={box}
          pointerRef={pointerRef}
          paused={paused}
          reducedMotion={reducedMotion}
          onMood={(mood, skill) => {
            const kind = behaviourKind(mood, skill);
            if (kind) onBehaviour?.(kind, entry);
          }}
        />
      ))}
    </div>
  );
}

function behaviourKind(mood: CreatureMood, skill: SkillId | null): keyof BehaviourCounters | null {
  if (skill === "skate") return "skated";
  if (skill === "hide") return "hid";
  if (skill === "nap") return "napped";
  if (mood === "climb") return "climbed";
  if (mood === "nap") return "napped";
  if (mood === "follow") return "followedCursor";
  if (mood === "walk") return "explored";
  if (mood === "hide") return "hid";
  return null;
}
