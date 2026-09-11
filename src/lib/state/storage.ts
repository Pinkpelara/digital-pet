import type { CompanionInstance, DemoUser, OwnershipRecord } from "@/lib/types";
import { randomSeed, statsFromSeed } from "@/lib/personality";

/** v2: companions now carry a hidden personality seed. Old demo data is ignored. */
const KEY = "companions.nest.v2";

export type PersistedNest = {
  user: DemoUser | null;
  ownership: OwnershipRecord[];
  instances: CompanionInstance[];
  creaturesEnabled: boolean;
};

export const EMPTY_NEST: PersistedNest = {
  user: null,
  ownership: [],
  instances: [],
  creaturesEnabled: true,
};

export const emptyNest = (): PersistedNest => EMPTY_NEST;

/** Defensive: an instance without a seed is not a valid individual. */
function normalize(instance: CompanionInstance): CompanionInstance {
  if (instance.seed?.values) {
    return {
      ...instance,
      discovered: instance.discovered ?? [],
      counters: instance.counters ?? {},
      secrets: instance.secrets ?? [],
      favouriteSpot: instance.favouriteSpot ?? null,
      bonds: instance.bonds ?? [],
    };
  }
  const seed = randomSeed();
  return {
    ...instance,
    seed,
    stats: statsFromSeed(seed),
    discovered: instance.discovered ?? [],
    counters: instance.counters ?? {},
    secrets: instance.secrets ?? [],
    favouriteSpot: instance.favouriteSpot ?? null,
    bonds: instance.bonds ?? [],
  };
}

export function readNest(): PersistedNest {
  if (typeof window === "undefined") return emptyNest();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyNest();
    const parsed = JSON.parse(raw) as PersistedNest;
    return {
      user: parsed.user ?? null,
      ownership: parsed.ownership ?? [],
      instances: (parsed.instances ?? []).map(normalize),
      creaturesEnabled: parsed.creaturesEnabled ?? true,
    };
  } catch {
    return emptyNest();
  }
}

export function writeNest(nest: PersistedNest): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(nest));
  } catch {
    /* private mode / blocked storage */
  }
}
