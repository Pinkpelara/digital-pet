import { companions, items } from "@/data/catalog";
import { applyTendencies, fullLabels, randomSeed, statsFromSeed } from "@/lib/personality";
import type { CompanionInstance, DemoUser, OwnershipRecord, SkillId } from "@/lib/types";
import type { PersistedNest } from "@/lib/state/storage";

export const demoUser = (): DemoUser => ({
  id: "demo-user",
  email: "you@companions.local",
  displayName: "Explorer",
  publicId: "cmp-42",
  provider: "demo",
});

/**
 * A new individual. Species tendencies shape the seed; the seed stays hidden
 * and cannot be edited. The first personality label is obvious immediately,
 * the rest arrive as you live together.
 */
export function newCompanionInstance(
  speciesId: CompanionInstance["speciesId"],
  ownershipId: string,
  userId: string,
  name?: string,
): CompanionInstance {
  const species = companions.find((entry) => entry.id === speciesId) ?? companions[0];
  const seed = applyTendencies(randomSeed(), species.tendencies);
  const at = new Date().toISOString();
  const first = fullLabels(seed)[0];
  return {
    id: crypto.randomUUID(),
    userId,
    speciesId: species.id,
    ownershipId,
    name: name ?? species.name,
    publicId: `cmp-${Math.random().toString(36).slice(2, 7)}`,
    seed,
    stats: statsFromSeed(seed),
    equipped: {},
    unlockedSkills: [...species.nativeSkills],
    discovered: first ? [{ label: first, at }] : [],
    counters: {},
    secrets: [],
    favouriteSpot: null,
    bonds: [],
    createdAt: at,
  };
}

export function grantItemsLocally(
  prev: PersistedNest,
  itemIds: string[],
  source: OwnershipRecord["source"] = "purchase",
): PersistedNest {
  const user = prev.user ?? demoUser();
  const ownershipByItem = new Map(prev.ownership.map((row) => [row.itemId, row]));
  const instanceById = new Map(prev.instances.map((row) => [row.id, row]));

  for (const itemId of itemIds) {
    const item = items.find((entry) => entry.id === itemId && entry.active);
    if (!item) continue;
    if (!ownershipByItem.has(itemId)) {
      ownershipByItem.set(itemId, {
        id: crypto.randomUUID(),
        userId: user.id,
        itemId,
        source,
        grantedAt: new Date().toISOString(),
      });
    }
    if (item.kind === "companion" && item.speciesId) {
      // Every adoption is a new individual. Two Bloops are two different
      // creatures with different hidden personalities — that is the point.
      const ownership = ownershipByItem.get(itemId)!;
      const instance = newCompanionInstance(item.speciesId, ownership.id, user.id);
      instanceById.set(instance.id, instance);
    }
  }

  // Skills are taught, not worn: owning one unlocks it for every companion.
  const instances = [...instanceById.values()].map((instance) => {
    let next = instance;
    for (const itemId of itemIds) {
      const item = items.find((entry) => entry.id === itemId);
      if (item?.skillId && !next.unlockedSkills.includes(item.skillId)) {
        next = { ...next, unlockedSkills: [...next.unlockedSkills, item.skillId as SkillId] };
      }
    }
    return next;
  });

  return {
    ...prev,
    user,
    ownership: [...ownershipByItem.values()],
    instances,
  };
}
