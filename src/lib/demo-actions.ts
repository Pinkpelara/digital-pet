import { catalogById, items } from "@/data/catalog";
import type {
  CatalogItem,
  DemoActionId,
  EquipmentLoadout,
  SkillId,
  SpeciesId,
} from "@/lib/types";

export type WheelKind = "gadget" | "skill";

export type WheelAction = {
  itemId: string;
  action: DemoActionId;
  kind: WheelKind;
  /** Radial label: toy name, or "Teach X" for skills. */
  label: string;
  shortLabel: string;
  accent: string;
  icon: WheelIconId;
  equip: EquipmentLoadout;
  skill: SkillId | null;
  loops: boolean;
};

export type WheelIconId =
  | "skate"
  | "umbrella"
  | "camera"
  | "balloon"
  | "broom"
  | "moonwalk"
  | "climb"
  | "nap"
  | "dance"
  | "cartwheel"
  | "hide"
  | "juggle";

export type ResolvedWheelItem = WheelAction & {
  preview: boolean;
  owned: boolean;
};

const ACTION_BY_ITEM: Record<string, DemoActionId> = {
  "gadget-skateboard": "skate",
  "gadget-umbrella": "rain-walk",
  "gadget-camera": "photo-pose",
  "gadget-balloon": "hover",
  "gadget-broom": "tidy",
  "skill-moonwalk": "moonwalk",
  "skill-climb": "climb",
  "skill-nap": "nap",
  "skill-dance": "dance",
  "skill-cartwheel": "cartwheel",
  "skill-hide": "hide",
  "skill-juggle": "juggle",
  "skill-skate": "skate",
};

const ICON_BY_ACTION: Record<DemoActionId, WheelIconId> = {
  skate: "skate",
  "rain-walk": "umbrella",
  "photo-pose": "camera",
  hover: "balloon",
  tidy: "broom",
  moonwalk: "moonwalk",
  climb: "climb",
  nap: "nap",
  dance: "dance",
  cartwheel: "cartwheel",
  hide: "hide",
  juggle: "juggle",
};

const LOOPING: Set<DemoActionId> = new Set([
  "skate",
  "moonwalk",
  "rain-walk",
  "climb",
  "nap",
  "hover",
  "dance",
  "hide",
  "tidy",
  "photo-pose",
]);

/** Equip is the demo. If a board is on the feet, they skate this frame — no effect delay. */
export function actionFromLoadout(
  equipped: EquipmentLoadout | undefined,
  skill?: SkillId | null,
  demo?: DemoActionId | null,
): DemoActionId | null {
  if (demo) return demo;
  if (skill) return skill;
  if (!equipped) return null;
  if (equipped.feet === "gadget-skateboard") return "skate";
  if (equipped.hand === "gadget-umbrella") return "rain-walk";
  if (equipped.hand === "gadget-camera") return "photo-pose";
  if (equipped.back === "gadget-balloon") return "hover";
  if (equipped.hand === "gadget-broom") return "tidy";
  return null;
}

/** Signature demos everyone can preview on a live stage. */
const PREVIEW_QUEUE = [
  "gadget-skateboard",
  "gadget-umbrella",
  "skill-moonwalk",
  "skill-climb",
  "skill-nap",
  "gadget-camera",
  "skill-dance",
  "gadget-balloon",
] as const;

const SPECIES_EXTRAS: Record<SpeciesId, string[]> = {
  bloop: ["skill-climb", "gadget-umbrella", "gadget-camera"],
  niblet: ["gadget-skateboard", "skill-moonwalk", "skill-dance"],
  mochi: ["skill-nap", "gadget-broom", "outfit-hoodie"],
  sprout: ["gadget-balloon", "skill-hide", "gadget-camera"],
};

export function demoActionForItem(item: CatalogItem): DemoActionId | null {
  if (item.skillId) return item.skillId;
  if (item.id in ACTION_BY_ITEM) return ACTION_BY_ITEM[item.id];
  return null;
}

export function isDemoActionId(value: string | null | undefined): value is DemoActionId {
  if (!value) return false;
  return value in ICON_BY_ACTION;
}

export function skillFromDemo(action: DemoActionId | null): SkillId | null {
  if (!action) return null;
  const skills: SkillId[] = ["moonwalk", "cartwheel", "climb", "dance", "hide", "juggle", "skate", "nap"];
  return skills.includes(action as SkillId) ? (action as SkillId) : null;
}

export function moodFromDemo(action: DemoActionId | null): "idle" | "nap" | "climb" | "happy" | "hide" | "skill" {
  if (!action) return "idle";
  if (action === "nap") return "nap";
  if (action === "climb") return "climb";
  if (action === "hide") return "hide";
  if (action === "dance" || action === "skate" || action === "moonwalk") return "happy";
  return "skill";
}

export function demoDurationMs(action: DemoActionId): number {
  if (LOOPING.has(action)) return 0;
  if (action === "cartwheel") return 1400;
  if (action === "photo-pose") return 2600;
  if (action === "juggle") return 3200;
  return 2800;
}

function loadoutFor(item: CatalogItem, action: DemoActionId): EquipmentLoadout {
  const loadout: EquipmentLoadout = {};
  if (item.slot) loadout[item.slot] = item.id;
  if (action === "rain-walk") {
    loadout.hand = "gadget-umbrella";
    loadout.body = "outfit-raincoat";
  }
  if (action === "skate") loadout.feet = "gadget-skateboard";
  if (action === "moonwalk") loadout.face = "outfit-sunglasses";
  if (action === "photo-pose") loadout.hand = "gadget-camera";
  if (action === "hover") loadout.back = "gadget-balloon";
  if (action === "tidy") loadout.hand = "gadget-broom";
  if (action === "nap") loadout.body = "outfit-hoodie";
  return loadout;
}

export function wheelActionFromItem(item: CatalogItem): WheelAction | null {
  const action = demoActionForItem(item);
  if (!action) return null;
  const kind: WheelKind = item.kind === "skill" ? "skill" : "gadget";
  const name = item.name;
  return {
    itemId: item.id,
    action,
    kind,
    label: kind === "skill" ? `Teach ${name}` : name,
    shortLabel: kind === "skill" ? `Teach ${name}` : name,
    accent: item.accent,
    icon: ICON_BY_ACTION[action],
    equip: loadoutFor(item, action),
    skill: skillFromDemo(action),
    loops: LOOPING.has(action),
  };
}

function uniqueActions(ids: string[]): WheelAction[] {
  const seen = new Set<DemoActionId>();
  const out: WheelAction[] = [];
  for (const id of ids) {
    const item = catalogById.get(id) ?? items.find((entry) => entry.id === id);
    if (!item) continue;
    const action = wheelActionFromItem(item);
    if (!action || seen.has(action.action)) continue;
    seen.add(action.action);
    out.push(action);
  }
  return out;
}

/**
 * 6–8 radial slots for a live companion stage.
 * Owned gadgets/skills first, then signature previewables so demo mode always has a full wheel.
 */
export function wheelForCompanion(input: {
  species: SpeciesId;
  ownedItemIds?: Iterable<string>;
  unlockedSkills?: SkillId[];
  equipped?: EquipmentLoadout;
}): ResolvedWheelItem[] {
  const owned = new Set(input.ownedItemIds ?? []);
  const unlocked = new Set(input.unlockedSkills ?? []);
  const equippedIds = Object.values(input.equipped ?? {}).filter(Boolean) as string[];

  const ownedPlayables = items
    .filter((item) => {
      if (!owned.has(item.id) && !(item.skillId && unlocked.has(item.skillId))) return false;
      return Boolean(demoActionForItem(item));
    })
    .map((item) => item.id);

  const queue = [
    ...equippedIds,
    ...ownedPlayables,
    ...SPECIES_EXTRAS[input.species],
    ...PREVIEW_QUEUE,
  ];

  const actions = uniqueActions(queue).slice(0, 8);
  while (actions.length < 6) {
    const filler = uniqueActions([...PREVIEW_QUEUE]).find((entry) => !actions.some((row) => row.action === entry.action));
    if (!filler) break;
    actions.push(filler);
  }

  return actions.map((action) => {
    const item = catalogById.get(action.itemId);
    const ownedItem = owned.has(action.itemId) || (item?.skillId ? unlocked.has(item.skillId) : false);
    return { ...action, owned: ownedItem, preview: !ownedItem };
  });
}
