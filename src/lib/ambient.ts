import type {
  CreatureMood,
  DemoActionId,
  EquipmentLoadout,
  PersonalitySeed,
  PersonalityStats,
  SpeciesId,
} from "@/lib/types";

export type AmbientBeat = {
  mood: CreatureMood;
  action: DemoActionId | null;
  ms: number;
};

export type MoodWeight = { mood: CreatureMood; weight: number };

function stretch(ms: number, energy: number): number {
  const factor = 0.75 + (100 - energy) / 200;
  return Math.round(ms * factor);
}

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Hidden 0..1 from the seed. Same individual always gets the same bias for a key. */
export function seedUnit(seed: PersonalitySeed | undefined, key: string): number {
  return hash(`${seed?.id ?? "species"}:${key}`) / 4294967296;
}

function clampWeight(value: number): number {
  return Math.max(0.5, value);
}

/**
 * Species sets the habit. Seed only nudges playlist weights —
 * never enough to turn a Bloop into a Mochi.
 */
export function habitWeights(species: SpeciesId, seed?: PersonalitySeed): MoodWeight[] {
  const v = seed?.values;
  const energy = v?.energy ?? (species === "mochi" ? 22 : species === "niblet" ? 82 : 56);
  const sleep = v?.sleepiness ?? (species === "mochi" ? 84 : 28);
  const mischief = v?.mischief ?? (species === "niblet" ? 86 : 48);
  const curiosity = v?.curiosity ?? (species === "sprout" ? 80 : 55);
  const cling = v?.clinginess ?? 42;
  const shy = v ? 100 - (v.sociability ?? 50) : species === "mochi" ? 40 : 20;
  const drama = v?.drama ?? (species === "niblet" ? 70 : 30);
  const courage = v?.courage ?? 50;

  const table: Record<SpeciesId, MoodWeight[]> = {
    bloop: [
      { mood: "climb", weight: 52 },
      { mood: "walk", weight: 16 },
      { mood: "follow", weight: 14 },
      { mood: "idle", weight: 10 },
      { mood: "nap", weight: 8 },
    ],
    mochi: [
      { mood: "nap", weight: 50 },
      { mood: "idle", weight: 22 },
      { mood: "follow", weight: 12 },
      { mood: "walk", weight: 10 },
      { mood: "hide", weight: 6 },
    ],
    sprout: [
      { mood: "walk", weight: 38 },
      { mood: "hide", weight: 24 },
      { mood: "follow", weight: 16 },
      { mood: "idle", weight: 14 },
      { mood: "climb", weight: 8 },
    ],
    niblet: [
      { mood: "happy", weight: 36 },
      { mood: "idle", weight: 18 },
      { mood: "walk", weight: 16 },
      { mood: "follow", weight: 14 },
      { mood: "climb", weight: 8 },
      { mood: "hide", weight: 8 },
    ],
  };

  const nudged = table[species].map((entry) => {
    let weight = entry.weight;
    if (entry.mood === "climb") weight *= 0.72 + energy / 220 + curiosity / 260 + courage / 500;
    if (entry.mood === "nap") weight *= 0.68 + sleep / 140 + (100 - energy) / 260;
    if (entry.mood === "walk") weight *= 0.72 + curiosity / 200 + energy / 320;
    if (entry.mood === "hide") weight *= 0.7 + shy / 220 + curiosity / 320;
    if (entry.mood === "happy") weight *= 0.7 + mischief / 170 + drama / 260;
    if (entry.mood === "follow") weight *= 0.72 + cling / 190;
    if (entry.mood === "idle") weight *= 0.86 + shy / 420 + (100 - energy) / 500;
    return { mood: entry.mood, weight: clampWeight(weight) };
  });

  // Keep the species signature even if this individual is an outlier.
  const byMood = new Map(nudged.map((entry) => [entry.mood, entry]));
  const bump = (mood: CreatureMood, floor: number) => {
    const row = byMood.get(mood);
    if (row && row.weight < floor) row.weight = floor;
  };
  if (species === "bloop") bump("climb", 36);
  if (species === "mochi") bump("nap", 36);
  if (species === "sprout") {
    const walk = byMood.get("walk")?.weight ?? 0;
    const hide = byMood.get("hide")?.weight ?? 0;
    if (walk + hide < 48 && byMood.get("walk")) {
      byMood.get("walk")!.weight += 48 - walk - hide;
    }
  }
  if (species === "niblet") bump("happy", 26);

  return [...byMood.values()];
}

export function pickWeightedMood(weights: MoodWeight[], random = Math.random): CreatureMood {
  const total = weights.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = random() * total;
  for (const entry of weights) {
    roll -= entry.weight;
    if (roll <= 0) return entry.mood;
  }
  return weights[0]?.mood ?? "idle";
}

export function pickAmbientMood(
  species: SpeciesId,
  seed?: PersonalitySeed,
  _stats?: PersonalityStats,
  random = Math.random,
): CreatureMood {
  return pickWeightedMood(habitWeights(species, seed), random);
}

export function ambientDuration(
  species: SpeciesId,
  mood: CreatureMood,
  seed?: PersonalitySeed,
): number {
  const v = seed?.values;
  const energy = v?.energy ?? (species === "mochi" ? 22 : 56);
  const sleep = v?.sleepiness ?? (species === "mochi" ? 84 : 28);
  const cling = v?.clinginess ?? 42;
  const jitter = 0.86 + seedUnit(seed, `${mood}-len`) * 0.28;

  const base =
    species === "mochi" && mood === "nap"
      ? 16000 + sleep * 90
      : species === "bloop" && mood === "climb"
        ? 10000 + (100 - energy) * 20
        : species === "sprout" && (mood === "walk" || mood === "hide")
          ? 8000 + (v?.curiosity ?? 80) * 25
          : species === "niblet" && (mood === "happy" || mood === "idle")
            ? 9000 + (v?.mischief ?? 80) * 20
            : mood === "nap"
              ? 7000 + (100 - energy) * 30
              : mood === "climb"
                ? 8000
                : mood === "walk"
                  ? 7000 + energy * 20
                  : mood === "hide"
                    ? 6500
                    : mood === "follow"
                      ? 6000 + cling * 25
                      : mood === "happy"
                        ? 7000
                        : 5000 + (100 - energy) * 15;

  return Math.round(stretch(base, energy) * jitter);
}

/**
 * A short sample playlist — useful for tests and gear inserts.
 * Live idle picks from weights so the loop never feels scripted.
 */
export function ambientPlaylist(
  species: SpeciesId,
  seed?: PersonalitySeed,
  equipped: EquipmentLoadout = {},
): AmbientBeat[] {
  const weights = habitWeights(species, seed);
  const rand = (() => {
    let state = hash(seed?.id ?? species) || 1;
    return () => {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      state >>>= 0;
      return state / 4294967296;
    };
  })();

  const core: AmbientBeat[] = Array.from({ length: 6 }, () => {
    const mood = pickWeightedMood(weights, rand);
    return { mood, action: null, ms: ambientDuration(species, mood, seed) };
  });

  const energy = seed?.values.energy ?? (species === "mochi" ? 22 : 56);
  const mischief = seed?.values.mischief ?? (species === "niblet" ? 86 : 48);
  const extras: AmbientBeat[] = [];
  if (equipped.hand === "gadget-camera") {
    extras.push({ mood: "skill", action: "photo-pose", ms: stretch(4500, energy) });
  }
  if (equipped.feet === "gadget-skateboard") {
    extras.push({ mood: "happy", action: "skate", ms: stretch(7000, energy) });
  }
  if (equipped.hand === "gadget-umbrella") {
    extras.push({ mood: "idle", action: "rain-walk", ms: stretch(8000, energy) });
  }
  if (equipped.head === "gadget-headphones") {
    extras.push({ mood: "follow", action: "focus", ms: stretch(9000, energy) });
  }
  if (equipped.body === "outfit-raincoat" && !equipped.hand) {
    extras.push({ mood: "idle", action: "twirl", ms: stretch(4000, energy) });
  }

  if (extras.length === 0) return core;

  const insertAt = Math.min(core.length - 1, 1 + (mischief > 60 ? 1 : 0));
  return [...core.slice(0, insertAt), extras[0], ...core.slice(insertAt), ...extras.slice(1)];
}

export function patReaction(species: SpeciesId): AmbientBeat {
  if (species === "mochi") return { mood: "happy", action: null, ms: 2200 };
  if (species === "niblet") return { mood: "happy", action: "dance", ms: 2400 };
  if (species === "sprout") return { mood: "follow", action: null, ms: 2000 };
  return { mood: "happy", action: null, ms: 2000 };
}

export function dominantHabit(species: SpeciesId): CreatureMood {
  const ranked = [...habitWeights(species)].sort((a, b) => b.weight - a.weight);
  return ranked[0]?.mood ?? "idle";
}
