import { ambientDuration, pickAmbientMood } from "@/lib/ambient";
import type { CreatureMood, PersonalitySeed, PersonalityStats, SkillId, SpeciesId } from "@/lib/types";

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
  edge?: number;
};

export function pickMood(
  stats: PersonalityStats,
  random = Math.random,
  species: SpeciesId = "bloop",
  seed?: PersonalitySeed,
): CreatureMood {
  return pickAmbientMood(species, seed, stats, random);
}

export function moodDuration(
  mood: CreatureMood,
  stats: PersonalityStats,
  species: SpeciesId = "bloop",
  seed?: PersonalitySeed,
): number {
  return ambientDuration(species, mood, seed) * (0.92 + (stats.chaos / 100) * 0.12);
}

function nextEdge(width: number, height: number, index: number): { x: number; y: number } {
  const edges = [
    { x: 18, y: height * 0.42 },
    { x: width * 0.5, y: 18 },
    { x: Math.max(24, width - 110), y: height * 0.38 },
    { x: width * 0.55, y: Math.max(24, height - 150) },
  ];
  return edges[((index % 4) + 4) % 4];
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
    species?: SpeciesId;
    seed?: PersonalitySeed;
  },
): ActorState {
  if (input.paused || input.reducedMotion) {
    return { ...actor, vx: 0, mood: actor.mood === "nap" ? "nap" : "idle", skill: null };
  }

  const species = input.species ?? "bloop";
  const next = { ...actor };
  if (input.now > next.until && !next.skill) {
    next.mood = pickMood(input.stats, Math.random, species, input.seed);
    next.until = input.now + moodDuration(next.mood, input.stats, species, input.seed);
    if (next.mood === "walk" || next.mood === "climb") next.facing = Math.random() > 0.5 ? 1 : -1;
    if (species === "sprout") next.edge = (next.edge ?? 0) + 1;
  }

  const speed = 0.045 + input.stats.energy * 0.00025;
  const maxX = Math.max(24, input.width - 96);
  const maxY = Math.max(24, input.height - 140);

  if (species === "bloop" && (next.mood === "climb" || next.mood === "walk")) {
    next.y -= next.mood === "climb" ? 0.85 : 0.15;
    next.x += next.facing * speed * 10;
    if (next.y < 10) {
      next.y = 10;
      next.x += next.facing * 1.2;
    }
  } else if (species === "mochi" && (next.mood === "nap" || next.mood === "idle" || next.mood === "hide")) {
    const cornerX = input.stats.cling > 50 ? 16 : maxX;
    const cornerY = 20;
    next.x += Math.sign(cornerX - next.x) * 0.7;
    next.y += Math.sign(cornerY - next.y) * 0.45;
    next.vx = 0;
  } else if (species === "sprout") {
    const spot = nextEdge(input.width, input.height, next.edge ?? 0);
    const arrive = Math.hypot(spot.x - next.x, spot.y - next.y) < 18;
    if (next.mood === "hide" || (arrive && next.mood !== "walk")) {
      next.vx = 0;
    } else {
      next.x += Math.sign(spot.x - next.x) * Math.min(1.4, Math.abs(spot.x - next.x));
      next.y += Math.sign(spot.y - next.y) * Math.min(1.1, Math.abs(spot.y - next.y));
      next.facing = spot.x >= next.x ? 1 : -1;
    }
  } else if (species === "niblet" && (next.mood === "happy" || next.mood === "idle" || next.mood === "hide")) {
    const perchX = maxX - 8;
    const perchY = maxY - 10;
    next.x += Math.sign(perchX - next.x) * 1.2;
    next.y += Math.sign(perchY - next.y) * 0.9;
    next.vx = 0;
  } else if (next.mood === "walk") {
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
