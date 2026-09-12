import type { CreatureMood, PersonalityStats, SkillId } from "@/lib/types";

export type ActorState = {
  x: number;
  y: number;
  vx: number;
  facing: 1 | -1;
  mood: CreatureMood;
  skill: SkillId | null;
  until: number;
  lookX: number | null;
  lookY: number | null;
};

const MOOD_WEIGHTS: Array<{ mood: CreatureMood; weight: number }> = [
  { mood: "idle", weight: 38 },
  { mood: "walk", weight: 26 },
  { mood: "nap", weight: 14 },
  { mood: "follow", weight: 16 },
  { mood: "climb", weight: 6 },
  { mood: "hide", weight: 8 },
];

export function pickMood(stats: PersonalityStats, random = Math.random): CreatureMood {
  const adjusted = MOOD_WEIGHTS.map((entry) => {
    let weight = entry.weight;
    if (entry.mood === "nap") weight += (100 - stats.energy) * 0.2;
    if (entry.mood === "follow") weight += stats.cling * 0.18;
    if (entry.mood === "walk" || entry.mood === "climb") weight += stats.curiosity * 0.12 + stats.energy * 0.08;
    if (entry.mood === "idle") weight += stats.shy * 0.1;
    if (entry.mood === "hide") weight += stats.shy * 0.12;
    if (stats.chaos > 70 && entry.mood === "walk") weight += 10;
    return { ...entry, weight };
  });
  const total = adjusted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = random() * total;
  for (const entry of adjusted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.mood;
  }
  return "idle";
}

export function moodDuration(mood: CreatureMood, stats: PersonalityStats): number {
  const chaosJitter = stats.chaos * 8;
  switch (mood) {
    case "idle":
      return 2200 + stats.shy * 18;
    case "walk":
      return 2800 + stats.energy * 12;
    case "nap":
      return 4000 + (100 - stats.energy) * 20;
    case "follow":
      return 2400 + stats.cling * 16;
    case "climb":
      return 2600;
    case "hide":
      return 4200;
    default:
      return 2000 + chaosJitter;
  }
}

export function stepActor(
  actor: ActorState,
  input: {
    now: number;
    width: number;
    height: number;
    pointer: { x: number; y: number } | null;
    stats: PersonalityStats;
    paused: boolean;
    reducedMotion: boolean;
  },
): ActorState {
  if (input.paused || input.reducedMotion) {
    return { ...actor, vx: 0, mood: actor.mood === "nap" ? "nap" : "idle", skill: null };
  }

  const next = { ...actor };
  if (input.now > next.until && !next.skill) {
    next.mood = pickMood(input.stats);
    next.until = input.now + moodDuration(next.mood, input.stats);
    if (next.mood === "walk") next.facing = Math.random() > 0.5 ? 1 : -1;
  }

  const speed = 0.045 + input.stats.energy * 0.00025;
  if (next.mood === "walk") {
    next.vx = next.facing * speed;
    next.x += next.vx * 16;
  } else if (next.mood === "follow" && input.pointer) {
    const dx = input.pointer.x - next.x;
    next.facing = dx >= 0 ? 1 : -1;
    next.x += Math.sign(dx) * Math.min(Math.abs(dx), 1.6);
    next.y += Math.sign(input.pointer.y - 40 - next.y) * 0.35;
  } else if (next.mood === "climb") {
    next.y -= 0.7;
  } else {
    next.vx = 0;
  }

  if (input.pointer) {
    next.lookX = input.pointer.x;
    next.lookY = input.pointer.y;
  }

  const maxX = Math.max(24, input.width - 96);
  const maxY = Math.max(24, input.height - 140);
  if (next.x < 8) {
    next.x = 8;
    next.facing = 1;
  }
  if (next.x > maxX) {
    next.x = maxX;
    next.facing = -1;
  }
  if (next.y < 8) next.y = 8;
  if (next.y > maxY) next.y = maxY;
  return next;
}
