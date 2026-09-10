import type {
  BehaviourCounters,
  DiscoveredTrait,
  PersonalityLabel,
  PersonalitySeed,
  PersonalityStats,
  TraitKey,
} from "@/lib/types";

/**
 * Individuality lives here.
 *
 * A species has tendencies. An adopted companion gets its own hidden seed.
 * The user never sees numbers and cannot edit them — they discover the
 * personality by living with the creature.
 */

export const TRAIT_KEYS: TraitKey[] = [
  "curiosity",
  "courage",
  "clinginess",
  "sleepiness",
  "sociability",
  "mischief",
  "energy",
  "drama",
];

export const TRAIT_LABELS: Record<TraitKey, string> = {
  curiosity: "Curiosity",
  courage: "Courage",
  clinginess: "Clinginess",
  sleepiness: "Sleepiness",
  sociability: "Sociability",
  mischief: "Mischief",
  energy: "Energy",
  drama: "Drama",
};

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRandom(seed: number): () => number {
  let state = seed || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };
}

function clamp(value: number): number {
  return Math.max(1, Math.min(100, Math.round(value)));
}

/** Random individual. Used at adoption. */
export function randomSeed(): PersonalitySeed {
  return seedFromString(`${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
}

/** Same string always produces the same creature. Used for demos and fixtures. */
export function seedFromString(input: string): PersonalitySeed {
  const rand = makeRandom(hash(input));
  const values = {} as Record<TraitKey, number>;
  for (const key of TRAIT_KEYS) {
    values[key] = clamp(12 + rand() * 84);
  }
  return { id: input, values };
}

/** Species tendencies nudge the individual without erasing it. */
export function applyTendencies(
  seed: PersonalitySeed,
  tendencies: Partial<Record<TraitKey, number>>,
): PersonalitySeed {
  const values = { ...seed.values };
  for (const [key, target] of Object.entries(tendencies) as Array<[TraitKey, number]>) {
    values[key] = clamp((values[key] + target) / 2 + (values[key] - 50) * 0.22);
  }
  return { ...seed, values };
}

/** The behaviour engine speaks in six numbers. The seed is the truth. */
export function statsFromSeed(seed: PersonalitySeed): PersonalityStats {
  const v = seed.values;
  return {
    chaos: clamp(v.mischief * 0.8 + v.drama * 0.2),
    drama: clamp(v.drama),
    energy: clamp(v.energy * 0.75 + (100 - v.sleepiness) * 0.25),
    shy: clamp(v.courage * -0.7 + 80 + (100 - v.sociability) * 0.2),
    cling: clamp(v.clinginess),
    curiosity: clamp(v.curiosity),
  };
}

type LabelRule = {
  label: PersonalityLabel;
  test: (v: Record<TraitKey, number>) => number;
};

/** Each rule returns a strength; the strongest few become visible labels. */
const LABEL_RULES: LabelRule[] = [
  { label: "Curious", test: (v) => v.curiosity - 62 },
  { label: "Nosy", test: (v) => (v.curiosity > 78 && v.mischief > 55 ? v.curiosity - 66 : -99) },
  { label: "Cowardly", test: (v) => 40 - v.courage },
  { label: "Brave", test: (v) => v.courage - 74 },
  { label: "Clingy", test: (v) => v.clinginess - 68 },
  { label: "Sleepy", test: (v) => v.sleepiness - 66 },
  { label: "Restless", test: (v) => v.energy - 74 },
  { label: "Dramatic", test: (v) => v.drama - 70 },
  { label: "Chaotic", test: (v) => v.mischief - 72 },
  { label: "Show-off", test: (v) => (v.drama > 62 && v.sociability > 62 ? v.sociability - 60 : -99) },
  { label: "Shy", test: (v) => 34 - v.sociability },
  { label: "Friendly", test: (v) => v.sociability - 76 },
];

/** Labels this individual would show if fully discovered, strongest first. */
export function fullLabels(seed: PersonalitySeed): PersonalityLabel[] {
  return LABEL_RULES.map((rule) => ({ label: rule.label, score: rule.test(seed.values) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.label);
}

/** What has been discovered so far (stored on the instance). */
export function discoveredLabels(discovered: DiscoveredTrait[]): PersonalityLabel[] {
  return discovered.map((entry) => entry.label);
}

/**
 * Reveal one more label, if the creature has been lived with long enough.
 * Discovery is gradual and one-way: you cannot un-meet a trait.
 */
export function revealNextTrait(
  seed: PersonalitySeed,
  discovered: DiscoveredTrait[],
  counters: BehaviourCounters,
): DiscoveredTrait | null {
  const all = fullLabels(seed);
  const have = new Set(discovered.map((entry) => entry.label));
  const next = all.find((label) => !have.has(label));
  if (!next) return null;
  const observed = Object.values(counters).reduce((sum, value) => sum + (value ?? 0), 0);
  if (observed < discovered.length * 6 + 4) return null;
  return { label: next, at: new Date().toISOString() };
}

/** The share-card headline. Two words, maximum damage. */
export function personalityTitle(seed: PersonalitySeed): string {
  const v = seed.values;
  const first =
    v.mischief > 68 || v.drama > 68
      ? "CHAOTIC"
      : v.sleepiness > 68
        ? "SLEEPY"
        : v.curiosity > 70
          ? "NOSY"
          : v.energy > 72
            ? "RESTLESS"
            : "QUIET";
  const second =
    v.courage < 40
      ? "COWARD"
      : v.clinginess > 68
        ? "SHADOW"
        : v.drama > 66
          ? "SCENE-STEALER"
          : v.sociability > 70
            ? "SHOW-OFF"
            : "EXPLORER";
  return `${first} ${second}`;
}

/** Three deadpan lines for the reveal card. */
export function personalityLines(seed: PersonalitySeed, name: string): string[] {
  const v = seed.values;
  const lines: string[] = [];
  lines.push(
    v.curiosity > 66
      ? "Curious about everything."
      : "Curious about approximately one thing at a time.",
  );
  lines.push(
    v.courage < 42
      ? "Brave about almost nothing."
      : v.courage > 70
        ? "Brave to the point of bad decisions."
        : "Brave about the small stuff only.",
  );
  if (v.clinginess > 66) lines.push("Deeply suspicious of you leaving the tab.");
  else if (v.mischief > 70) lines.push("Deeply suspicious of sudden cursor movement.");
  else if (v.sleepiness > 66) lines.push("Deeply committed to horizontal living.");
  else lines.push("Deeply uninterested in your plans.");
  if (v.drama > 68) lines.push(`Everything is a performance. ${name} knows it.`);
  return lines.slice(0, 4);
}

/** Plain-language comparison for the "two of the same species" module. */
export function contrastLine(a: PersonalitySeed, b: PersonalitySeed): string {
  const traits: TraitKey[] = ["curiosity", "courage", "sleepiness", "clinginess", "mischief"];
  let best: { key: TraitKey; delta: number } | null = null;
  for (const key of traits) {
    const delta = Math.abs(a.values[key] - b.values[key]);
    if (!best || delta > best.delta) best = { key, delta };
  }
  if (!best) return "They are basically the same creature. Suspicious.";
  const high = a.values[best.key] > b.values[best.key] ? "left" : "right";
  const noun: Record<TraitKey, [string, string]> = {
    curiosity: ["investigates everything", "touches nothing"],
    courage: ["jumps first", "checks for danger, twice"],
    sleepiness: ["naps constantly", "never stops moving"],
    clinginess: ["follows every cursor", "keeps a dignified distance"],
    mischief: ["starts problems", "watches problems happen"],
    sociability: ["greets everyone", "greets nobody"],
    energy: ["bounces", "loafs"],
    drama: ["performs", "under-reacts"],
  };
  const pair = noun[best.key];
  return `One ${high === "left" ? pair[0] : pair[1]}. The other ${high === "left" ? pair[1] : pair[0]}.`;
}

export function traitWord(value: number, high: string, low: string): string {
  return value > 60 ? high : value < 35 ? low : "somewhere in between";
}

/** A stage mood that matches this seed — for the twin comparison, not a slider. */
export function moodFromSeed(seed: PersonalitySeed): import("@/lib/types").CreatureMood {
  const v = seed.values;
  const ranked: Array<[import("@/lib/types").CreatureMood, number]> = [
    ["nap", v.sleepiness],
    ["climb", v.curiosity * 0.6 + v.courage * 0.4],
    ["follow", v.clinginess],
    ["hide", 100 - v.sociability],
    ["happy", v.drama * 0.5 + v.energy * 0.5],
  ];
  ranked.sort((a, b) => b[1] - a[1]);
  return ranked[0][0];
}
