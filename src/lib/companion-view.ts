import { companionById, items } from "@/data/catalog";
import { fullLabels, personalityLines, personalityTitle } from "@/lib/personality";
import type { CompanionInstance } from "@/lib/types";

export function daysTogether(instance: CompanionInstance): number {
  const start = new Date(instance.createdAt).getTime();
  if (Number.isNaN(start)) return 0;
  return Math.max(0, Math.floor((Date.now() - start) / 86400000));
}

export function wearingNames(instance: CompanionInstance): string[] {
  return Object.values(instance.equipped)
    .filter(Boolean)
    .map((id) => items.find((item) => item.id === id)?.name)
    .filter((name): name is string => Boolean(name));
}

export function gadgetNames(instance: CompanionInstance): string[] {
  return Object.values(instance.equipped)
    .filter(Boolean)
    .map((id) => items.find((item) => item.id === id))
    .filter((item) => item?.kind === "gadget")
    .map((item) => item!.name);
}

export function favouriteGadget(instance: CompanionInstance): string | null {
  return gadgetNames(instance)[0] ?? null;
}

export function skillNames(instance: CompanionInstance): string[] {
  return instance.unlockedSkills
    .map((id) => items.find((item) => item.skillId === id)?.name)
    .filter((name): name is string => Boolean(name)) as string[];
}

export function speciesName(instance: CompanionInstance): string {
  return companionById.get(instance.speciesId)?.name ?? instance.speciesId;
}

export function secretTotal(instance: CompanionInstance): number {
  return companionById.get(instance.speciesId)?.secrets.length ?? 0;
}

/** The strongest observed behaviour, for the "what did they just do" card. */
export function latestBehaviour(instance: CompanionInstance): string {
  const entries = Object.entries(instance.counters) as Array<[string, number]>;
  if (entries.length === 0) return "has not done anything yet — give it a minute";
  const [kind, count] = entries.sort((a, b) => b[1] - a[1])[0];
  const verb: Record<string, string> = {
    climbed: "climbed something unnecessary",
    napped: "fell asleep in the middle of everything",
    followedCursor: "followed your cursor around",
    fell: "fell over",
    hid: "hid and waited to be found",
    skated: "skated into a corner",
    photographed: "took a photo of nothing",
    played: "played with the ball",
    explored: "went on an expedition",
  };
  const times = count > 3 ? " (again)" : "";
  return `${verb[kind] ?? kind}${times}`;
}

export function revealCard(instance: CompanionInstance) {
  const name = instance.name;
  return {
    title: personalityTitle(instance.seed),
    lines: personalityLines(instance.seed, name),
    labels: fullLabels(instance.seed),
    discovered: instance.discovered.map((entry) => entry.label),
  };
}
