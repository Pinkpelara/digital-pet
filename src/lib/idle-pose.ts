import { seedUnit } from "@/lib/ambient";
import type { CreatureMood, PersonalitySeed, SpeciesId } from "@/lib/types";

export type IdlePose = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  scale: number;
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smooth(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function along(
  points: Array<{ x: number; y: number; z?: number }>,
  t: number,
): { x: number; y: number; z: number } {
  if (points.length === 0) return { x: 0, y: 0, z: 0 };
  if (points.length === 1) return { x: points[0].x, y: points[0].y, z: points[0].z ?? 0 };
  const clamped = ((t % 1) + 1) % 1;
  const scaled = clamped * (points.length - 1);
  const i = Math.min(points.length - 2, Math.floor(scaled));
  const u = smooth(scaled - i);
  const a = points[i];
  const b = points[i + 1];
  return {
    x: lerp(a.x, b.x, u),
    y: lerp(a.y, b.y, u),
    z: lerp(a.z ?? 0, b.z ?? 0, u),
  };
}

function signFromSeed(seed: PersonalitySeed | undefined, key: string): 1 | -1 {
  return seedUnit(seed, key) > 0.5 ? 1 : -1;
}

/** Bloop treats the screen as a gym: climb, traverse, drop, climb the other wall. */
function bloopGym(t: number, seed?: PersonalitySeed): IdlePose {
  const wall = signFromSeed(seed, "gym-wall");
  const pace = 0.085 + seedUnit(seed, "gym-pace") * 0.03;
  const cycle = ((t * pace) % 1 + 1) % 1;
  const path = [
    { x: -0.62 * wall, y: 0.02 },
    { x: -0.66 * wall, y: 0.78 },
    { x: 0.64 * wall, y: 0.86 },
    { x: 0.68 * wall, y: 0.08 },
    { x: 0.18 * wall, y: 0.04 },
    { x: -0.22 * wall, y: 0.58 },
    { x: -0.62 * wall, y: 0.02 },
  ];
  const p = along(path, cycle);
  const climbing = p.y > 0.35;
  const dropping = cycle > 0.42 && cycle < 0.58;
  return {
    x: p.x,
    y: p.y + Math.sin(t * 6.2) * 0.03,
    z: p.z,
    rx: climbing ? -0.16 : dropping ? 0.22 : 0.04,
    ry: wall * (climbing ? 0.15 : 0.4),
    rz: dropping ? Math.sin(t * 10) * 0.28 : Math.sin(t * 4.2) * 0.08,
    scale: dropping ? 0.96 : 1,
  };
}

/** Mochi finds a warm corner and melts into it. */
function mochiCorner(t: number, mood: CreatureMood, seed?: PersonalitySeed): IdlePose {
  const side = signFromSeed(seed, "warm-side");
  const deep = 0.78 + seedUnit(seed, "warm-depth") * 0.18;
  const settled = mood === "nap" || mood === "hide";
  const x = side * deep;
  const y = settled ? -0.3 : -0.18;
  const breathe = Math.sin(t * (settled ? 0.7 : 1.05)) * (settled ? 0.01 : 0.025);
  return {
    x,
    y: y + breathe,
    z: 0.1,
    rx: settled ? 0.08 : 0.02,
    ry: -side * 0.35,
    rz: settled ? side * 0.7 : side * 0.18,
    scale: settled ? 0.92 : 0.97,
  };
}

const SPROUT_EDGES = [
  { x: -1.08, y: 0.1, z: 0 },
  { x: -0.12, y: 0.78, z: -0.08 },
  { x: 1.08, y: 0.12, z: 0 },
  { x: 0.22, y: -0.24, z: 0.08 },
];

/** Sprout maps edges, pauses to inspect, then goes again. */
function sproutEdges(t: number, mood: CreatureMood, seed?: PersonalitySeed): IdlePose {
  const start = Math.floor(seedUnit(seed, "edge-start") * SPROUT_EDGES.length);
  const dwell = 7.2 + seedUnit(seed, "edge-dwell") * 2.4;
  const index = (start + Math.floor(t / dwell)) % SPROUT_EDGES.length;
  const next = SPROUT_EDGES[(index + 1) % SPROUT_EDGES.length];
  const here = SPROUT_EDGES[index];
  const inspecting = mood === "hide" || mood === "idle";
  const u = inspecting ? 0 : smooth((t % dwell) / dwell);
  const x = lerp(here.x, next.x, u);
  const y = lerp(here.y, next.y, u);
  const z = lerp(here.z, next.z, u);
  return {
    x,
    y: y + (inspecting ? 0 : Math.abs(Math.sin(t * 3.6)) * 0.04),
    z,
    rx: inspecting ? 0.18 : 0.05,
    ry: x >= 0 ? 0.45 : -0.45,
    rz: inspecting ? 0.08 : Math.sin(t * 3.6) * 0.05,
    scale: inspecting ? 0.72 : 1,
  };
}

const NIBLET_PERCHES = [
  { x: 0.96, y: -0.34, z: 0.18 },
  { x: 0.82, y: 0.52, z: 0.08 },
  { x: -0.12, y: -0.3, z: 0.14 },
];

/** Niblet sits on chrome — buttons, corners, the thing you meant to press. */
function nibletPerch(t: number, mood: CreatureMood, seed?: PersonalitySeed): IdlePose {
  const start = Math.floor(seedUnit(seed, "perch-start") * NIBLET_PERCHES.length);
  const hop = mood === "walk" || mood === "follow";
  const dwell = hop ? 5.4 : 9.5 + seedUnit(seed, "perch-dwell") * 3;
  const index = (start + Math.floor(t / dwell)) % NIBLET_PERCHES.length;
  const here = NIBLET_PERCHES[index];
  const next = NIBLET_PERCHES[(index + 1) % NIBLET_PERCHES.length];
  const u = hop ? smooth((t % dwell) / dwell) : 0;
  const x = lerp(here.x, next.x, u);
  const y = lerp(here.y, next.y, u) + (hop ? Math.abs(Math.sin(u * Math.PI)) * 0.16 : 0);
  const sitting = !hop && (mood === "happy" || mood === "idle" || mood === "hide");
  return {
    x,
    y: y + (sitting ? Math.sin(t * 1.4) * 0.012 : 0),
    z: lerp(here.z, next.z, u),
    rx: sitting ? 0.12 : 0.04,
    ry: 0.55,
    rz: sitting ? -0.08 : Math.sin(t * 5) * 0.1,
    scale: sitting ? 0.88 : 1,
  };
}

function watchPose(t: number, pointer?: { x: number; y: number } | null): IdlePose {
  return {
    x: (pointer?.x ?? 0) * 0.22,
    y: 0.04 + Math.sin(t * 1.1) * 0.03,
    z: 0,
    rx: (pointer?.y ?? 0) * -0.12,
    ry: (pointer?.x ?? 0) * 0.38,
    rz: 0,
    scale: 1,
  };
}

function bobPose(t: number, happy: boolean): IdlePose {
  return {
    x: 0,
    y: Math.sin(t * 1.15) * 0.045 + (happy ? Math.abs(Math.sin(t * 4)) * 0.05 : 0),
    z: 0,
    rx: Math.sin(t * 0.24) * 0.04,
    ry: Math.sin(t * 0.32) * 0.09,
    rz: 0,
    scale: 1,
  };
}

/**
 * Unprompted, species-distinct place on the stage.
 * Seed only picks which wall / corner / edge / perch this individual prefers.
 */
export function idlePose(
  species: SpeciesId,
  mood: CreatureMood,
  t: number,
  seed?: PersonalitySeed,
  pointer?: { x: number; y: number } | null,
): IdlePose {
  if (mood === "follow") return watchPose(t, pointer);

  if (species === "bloop") {
    if (mood === "climb" || mood === "walk" || mood === "happy") return bloopGym(t, seed);
    if (mood === "nap") {
      const gym = bloopGym(t, seed);
      return { ...gym, y: Math.min(gym.y, 0.12), rz: 0.55, scale: 0.94 };
    }
    return { ...bloopGym(t, seed), y: 0.04 + Math.sin(t * 1.1) * 0.03, rz: 0.04, scale: 1 };
  }

  if (species === "mochi") {
    if (mood === "walk") {
      const side = signFromSeed(seed, "warm-side");
      return {
        x: Math.sin(t * 0.28) * 0.55 * side,
        y: -0.08 + Math.abs(Math.sin(t * 2.2)) * 0.04,
        z: 0.04,
        rx: 0.06,
        ry: side * 0.3,
        rz: Math.sin(t * 2.2) * 0.2,
        scale: 1,
      };
    }
    return mochiCorner(t, mood, seed);
  }

  if (species === "sprout") {
    if (mood === "climb") {
      const edge = sproutEdges(t, "walk", seed);
      return { ...edge, y: Math.max(edge.y, 0.55), rx: -0.14 };
    }
    return sproutEdges(t, mood, seed);
  }

  if (mood === "climb") {
    const perch = nibletPerch(t, "happy", seed);
    return { ...perch, y: perch.y + 0.42, rz: Math.sin(t * 3) * 0.1 };
  }
  return nibletPerch(t, mood, seed);
}

export function poseLerp(current: IdlePose, target: IdlePose, k: number): IdlePose {
  return {
    x: lerp(current.x, target.x, k),
    y: lerp(current.y, target.y, k),
    z: lerp(current.z, target.z, k),
    rx: lerp(current.rx, target.rx, k),
    ry: lerp(current.ry, target.ry, k),
    rz: lerp(current.rz, target.rz, k),
    scale: lerp(current.scale, target.scale, k),
  };
}
