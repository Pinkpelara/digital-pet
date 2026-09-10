import { companions, items, personalityShift } from "@/data/catalog";
import { clampStat } from "@/lib/format";
import type {
  CompanionInstance,
  DemoUser,
  OwnershipRecord,
  PersonalityStats,
  SkillId,
} from "@/lib/types";
import type { PersistedNest } from "@/lib/state/storage";

function applyPack(stats: PersonalityStats, itemId: string): PersonalityStats {
  const item = items.find((entry) => entry.id === itemId);
  if (!item?.personalityId) return stats;
  const shift = personalityShift(item.personalityId);
  return {
    chaos: clampStat(stats.chaos + (shift.chaos ?? 0)),
    drama: clampStat(stats.drama + (shift.drama ?? 0)),
    energy: clampStat(stats.energy + (shift.energy ?? 0)),
    shy: clampStat(stats.shy + (shift.shy ?? 0)),
    cling: clampStat(stats.cling + (shift.cling ?? 0)),
    curiosity: clampStat(stats.curiosity + (shift.curiosity ?? 0)),
  };
}

export const demoUser = (): DemoUser => ({
  id: "demo-user",
  email: "you@sillkin.local",
  displayName: "Explorer",
  publicId: "sill-42",
  provider: "demo",
});

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
      const species = companions.find((entry) => entry.id === item.speciesId);
      if (!already && species) {
        const ownership = ownershipByItem.get(itemId)!;
        const instance: CompanionInstance = {
          id: crypto.randomUUID(),
          userId: user.id,
          speciesId: species.id,
          ownershipId: ownership.id,
          name: species.name,
          publicId: `sill-${Math.random().toString(36).slice(2, 7)}`,
          stats: { ...species.defaultStats },
          equipped: {},
          unlockedSkills: [...species.nativeSkills],
          personalityPacks: [],
          createdAt: ownership.grantedAt,
        };
        instanceById.set(instance.id, instance);
      }
    }
  }

  const instances = [...instanceById.values()].map((instance) => {
    let next = instance;
    for (const itemId of itemIds) {
      const item = items.find((entry) => entry.id === itemId);
      if (!item) continue;
      if (item.skillId && !next.unlockedSkills.includes(item.skillId)) {
        next = { ...next, unlockedSkills: [...next.unlockedSkills, item.skillId as SkillId] };
      }
      if (item.personalityId && !next.personalityPacks.includes(item.personalityId)) {
        next = {
          ...next,
          personalityPacks: [...next.personalityPacks, item.personalityId],
          stats: applyPack(next.stats, item.id),
        };
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
