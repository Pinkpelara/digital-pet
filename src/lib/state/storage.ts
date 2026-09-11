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
  const extras = {
    equipped: instance.equipped ?? {},
    unlockedSkills: instance.unlockedSkills ?? [],
    discovered: instance.discovered ?? [],
    counters: instance.counters ?? {},
    secrets: instance.secrets ?? [],
    favouriteSpot: instance.favouriteSpot ?? null,
    bonds: instance.bonds ?? [],
  };
  if (instance.seed?.values) {
    return { ...instance, ...extras };
  }
  const seed = randomSeed();
  return {
    ...instance,
    ...extras,
    seed,
    stats: statsFromSeed(seed),
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

export function nestHasPossessions(nest: PersistedNest): boolean {
  return nest.instances.length > 0 || nest.ownership.length > 0;
}

function peekStoredNest(): PersistedNest | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedNest;
  } catch {
    return null;
  }
}

/**
 * Refuse to replace a nest that already has people/things with an empty one.
 * Hydration and demo boot used to write EMPTY_NEST over Kevin's umbrella.
 */
export function writeNest(nest: PersistedNest): boolean {
  if (typeof window === "undefined") return false;
  try {
    const existing = peekStoredNest();
    if (existing && nestHasPossessions(existing) && !nestHasPossessions(nest)) {
      return false;
    }
    window.localStorage.setItem(KEY, JSON.stringify(nest));
    return true;
  } catch {
    return false;
  }
}
