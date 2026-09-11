import { companions, items } from "@/data/catalog";
import { applyTendencies, randomSeed, statsFromSeed } from "@/lib/personality";
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
 * A new individual. Species tendencies shape the seed; the seed stays hidden.
 * You find out who they are by living with them — the site does not label them on day one.
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
    discovered: [],
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
      const already = [...instanceById.values()].some((row) => row.speciesId === item.speciesId);
      if (!already) {
        const ownership = ownershipByItem.get(itemId)!;
        const instance = newCompanionInstance(item.speciesId, ownership.id, user.id);
        instanceById.set(instance.id, instance);
      }
    }
  }

  const ownership = [...ownershipByItem.values()];
  const gear: CompanionInstance["equipped"] = {};
  for (const row of ownership) {
    const item = items.find((entry) => entry.id === row.itemId);
    if (item?.slot) gear[item.slot] = item.id;
  }

  // Skills unlock for everyone. Slotted stuff lives on the newest roommate.
  const raw = [...instanceById.values()].map((instance) => {
    let next = instance;
    for (const itemId of itemIds) {
      const item = items.find((entry) => entry.id === itemId);
      if (item?.skillId && !next.unlockedSkills.includes(item.skillId)) {
        next = { ...next, unlockedSkills: [...next.unlockedSkills, item.skillId as SkillId] };
      }
    }
    return next;
  });
  const newest = [...raw].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const instances = raw.map((instance) => {
    if (!newest || instance.id !== newest.id) return instance;
    return { ...instance, equipped: { ...instance.equipped, ...gear } };
  });

  return {
    ...prev,
    user,
    ownership,
    instances,
  };
}
