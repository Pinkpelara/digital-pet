import { catalogById } from "@/data/catalog";
import type {
  CatalogItem,
  DemoActionId,
  EquipmentLoadout,
  SkillId,
  SpeciesId,
} from "@/lib/types";

export type WheelKind = "gadget" | "skill" | "outfit" | "presence";

export type WheelAction = {
  itemId: string;
  action: DemoActionId;
  kind: WheelKind;
  /** Radial label: Say hi / Teach X / gadget name / outfit name / Nap / Parcel. */
  label: string;
  shortLabel: string;
  caption: string;
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
  | "juggle"
  | "outfit"
  | "mood"
  | "gift"
  | "study"
  | "mad"
  | "focus"
  | "stretch"
  | "party"
  | "chaos";

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
  "gadget-headphones": "focus",
  "gadget-partyhat": "party",
  "outfit-raincoat": "twirl",
  "outfit-hoodie": "twirl",
  "outfit-sunglasses": "twirl",
  "outfit-sproutcap": "twirl",
  "outfit-scarf": "twirl",
  "outfit-rainboots": "twirl",
  "drop-starrycoat": "twirl",
  "drop-cape": "twirl",
  "skill-moonwalk": "moonwalk",
  "skill-climb": "climb",
  "skill-nap": "nap",
  "skill-dance": "dance",
  "skill-cartwheel": "cartwheel",
  "skill-hide": "hide",
  "skill-juggle": "juggle",
  "skill-skate": "skate",
  "skill-focus": "focus",
  "skill-balloon-bunch": "balloon-bunch",
  "skill-chaos": "chaos",
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
  twirl: "outfit",
  "mood-peek": "mood",
  gift: "gift",
  study: "study",
  mad: "mad",
  focus: "focus",
  stretch: "stretch",
  adventure: "gift",
  party: "party",
  "balloon-bunch": "balloon",
  chaos: "chaos",
};

/** Loops forever on a live stage. Moonwalk is three steps, then a hold. */
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
  "study",
  "focus",
  "balloon-bunch",
  "party",
]);

/**
 * An action only ever uses the item it belongs to. A demo never invents
 * other products the visitor does not have: no raincoat inside a rain-walk,
 * no sunglasses inside a moonwalk, no hoodie inside a nap.
 */
export function loadoutForAction(item: CatalogItem | null, action: DemoActionId): EquipmentLoadout {
  const loadout: EquipmentLoadout = {};
  if (item?.slot) loadout[item.slot] = item.id;
  if (action === "rain-walk" && !loadout.hand) loadout.hand = "gadget-umbrella";
  if (action === "skate" && !loadout.feet) loadout.feet = "gadget-skateboard";
  if (action === "photo-pose" && !loadout.hand) loadout.hand = "gadget-camera";
  if (action === "hover" && !loadout.back) loadout.back = "gadget-balloon";
  if (action === "tidy" && !loadout.hand) loadout.hand = "gadget-broom";
  if (action === "focus" && !loadout.head) loadout.head = "gadget-headphones";
  if (action === "party" && !loadout.head) loadout.head = "gadget-partyhat";
  return loadout;
}

export function demoActionForItem(item: CatalogItem): DemoActionId | null {
  if (item.skillId) return item.skillId;
  if (item.id in ACTION_BY_ITEM) return ACTION_BY_ITEM[item.id];
  if (item.kind === "outfit" || item.kind === "drop") return "twirl";
  return null;
}

export function isDemoActionId(value: string | null | undefined): value is DemoActionId {
  if (!value) return false;
  return value in ICON_BY_ACTION;
}

export function skillFromDemo(action: DemoActionId | null): SkillId | null {
  if (!action) return null;
  const skills: SkillId[] = [
    "moonwalk",
    "cartwheel",
    "climb",
    "dance",
    "hide",
    "juggle",
    "skate",
    "nap",
    "focus",
    "balloon-bunch",
    "chaos",
  ];
  return skills.includes(action as SkillId) ? (action as SkillId) : null;
}

export function moodFromDemo(action: DemoActionId | null): "idle" | "nap" | "climb" | "happy" | "hide" | "skill" | "follow" {
  if (!action) return "idle";
  if (action === "nap") return "nap";
  if (action === "climb") return "climb";
  if (action === "hide") return "hide";
  if (action === "dance" || action === "skate" || action === "moonwalk" || action === "gift" || action === "twirl") {
    return "happy";
  }
  if (action === "mad") return "idle";
  if (action === "study" || action === "focus") return "follow";
  if (action === "stretch") return "idle";
  if (action === "adventure" || action === "party" || action === "balloon-bunch") return "happy";
  if (action === "chaos") return "skill";
  return "skill";
}

export function demoDurationMs(action: DemoActionId): number {
  if (LOOPING.has(action)) return 0;
  if (action === "moonwalk") return 1850;
  if (action === "twirl") return 1600;
  if (action === "mood-peek") return 1600;
  if (action === "gift") return 2000;
  if (action === "mad") return 1500;
  if (action === "stretch") return 2800;
  if (action === "adventure") return 3200;
  if (action === "party") return 0;
  if (action === "chaos") return 2400;
  if (action === "cartwheel") return 1400;
  if (action === "photo-pose") return 2600;
  if (action === "juggle") return 3200;
  return 2800;
}

/** 1–2s show-off before a price confirmation is allowed. */
export function showOffMs(action: DemoActionId | null): number {
  if (!action) return 1600;
  if (action === "moonwalk") return 1850;
  if (action === "rain-walk") return 1800;
  if (action === "skate") return 1800;
  return 1600;
}

/**
 * What the creature is doing right now. Only an explicit demo or a performed
 * skill counts. Wearing a gadget does not lock them into its animation —
 * owned gear just exists in the world; they use it when they feel like it.
 */
export function actionFromLoadout(
  _equipped: EquipmentLoadout | undefined,
  skill?: SkillId | null,
  demo?: DemoActionId | null,
): DemoActionId | null {
  if (demo) return demo;
  if (skill) return skill;
  return null;
}

export function speciesForCatalogItem(item: CatalogItem): SpeciesId {
  if (item.speciesId) return item.speciesId;
  if (item.compatibleSpecies?.[0]) return item.compatibleSpecies[0];
  if (item.looksGoodWith.includes("companion-niblet")) return "niblet";
  if (item.looksGoodWith.includes("companion-mochi")) return "mochi";
  if (item.looksGoodWith.includes("companion-sprout")) return "sprout";
  return "bloop";
}

export function loadoutForCatalogItem(item: CatalogItem): EquipmentLoadout {
  const action = demoActionForItem(item);
  if (!action) return item.slot ? { [item.slot]: item.id } : {};
  return loadoutForAction(item, action);
}

export function wheelActionFromItem(item: CatalogItem): WheelAction | null {
  const action = demoActionForItem(item);
  if (!action) return null;
  const kind: WheelKind = item.kind === "skill" ? "skill" : item.kind === "outfit" || item.kind === "drop" ? "outfit" : "gadget";
  const name = item.name;
  const label = kind === "skill" ? `Teach ${name}` : name;
  return {
    itemId: item.id,
    action,
    kind,
    label,
    shortLabel: label,
    caption: kind === "skill" && item.skillId === "moonwalk" ? "Moonwalk. Backward, smooth, slightly illegal." : label,
    accent: item.accent,
    icon: ICON_BY_ACTION[action],
    equip: loadoutForAction(item, action),
    skill: skillFromDemo(action),
    loops: LOOPING.has(action),
  };
}

function ownedFlag(itemId: string, owned: Set<string>, unlocked: Set<SkillId>): boolean {
  const item = catalogById.get(itemId);
  return owned.has(itemId) || (item?.skillId ? unlocked.has(item.skillId) : false);
}

function slot(
  action: WheelAction,
  owned: Set<string>,
  unlocked: Set<SkillId>,
  free = false,
): ResolvedWheelItem {
  const ownedItem = free || ownedFlag(action.itemId, owned, unlocked);
  return { ...action, owned: ownedItem, preview: !ownedItem };
}

/**
 * Live-pet radial: dedicated Moonwalk + Skateboard wedges that fire those demos,
 * plus sell-now Umbrella / Raincoat, then presence. 8 slots.
 * Skateboard / Moonwalk stay preview (shopSafe false) until a later shop-gate.
 */
export function presencePieForCompanion(input: {
  species: SpeciesId;
  ownedItemIds?: Iterable<string>;
  unlockedSkills?: SkillId[];
  equipped?: EquipmentLoadout;
}): ResolvedWheelItem[] {
  const owned = new Set(input.ownedItemIds ?? []);
  const unlocked = new Set(input.unlockedSkills ?? []);
  const moonwalk = catalogById.get("skill-moonwalk");
  const skate = catalogById.get("gadget-skateboard");
  const umbrella = catalogById.get("gadget-umbrella");
  const raincoat = catalogById.get("outfit-raincoat");
  const nap = catalogById.get("skill-nap");
  const climb = catalogById.get("skill-climb");

  const moonwalkAction = moonwalk ? wheelActionFromItem(moonwalk) : null;
  const skateAction = skate ? wheelActionFromItem(skate) : null;
  const umbrellaAction = umbrella ? wheelActionFromItem(umbrella) : null;
  const raincoatAction = raincoat ? wheelActionFromItem(raincoat) : null;
  const napAction = nap ? wheelActionFromItem(nap) : null;
  const climbAction = climb ? wheelActionFromItem(climb) : null;

  const pie: ResolvedWheelItem[] = [];

  if (moonwalkAction) {
    pie.push(
      slot(
        {
          ...moonwalkAction,
          label: "Moonwalk",
          shortLabel: "Moonwalk",
          caption: "Moonwalk. Backward, smooth, slightly illegal.",
        },
        owned,
        unlocked,
      ),
    );
  }
  if (skateAction) {
    pie.push(
      slot(
        {
          ...skateAction,
          label: "Skateboard",
          shortLabel: "Skateboard",
          caption: "They skate. Then show off about it.",
        },
        owned,
        unlocked,
      ),
    );
  }
  if (umbrellaAction) {
    pie.push(
      slot(
        { ...umbrellaAction, label: "Umbrella", shortLabel: "Pocket Umbrella", caption: "Opens a beat too late." },
        owned,
        unlocked,
      ),
    );
  }
  if (raincoatAction) {
    pie.push(
      slot(
        { ...raincoatAction, label: "Raincoat", shortLabel: "Yellow Raincoat", caption: "A raincoat changes how they look." },
        owned,
        unlocked,
      ),
    );
  }

  pie.push(
    slot(
      {
        itemId: "presence-greeting",
        action: "mood-peek",
        kind: "presence",
        label: "Say hi",
        shortLabel: "Say hi",
        caption: "They lean in to look at you.",
        accent: "#C5D4E0",
        icon: "mood",
        equip: {},
        skill: null,
        loops: false,
      },
      owned,
      unlocked,
      true,
    ),
  );

  if (napAction) {
    pie.push(
      slot(
        { ...napAction, label: "Nap", shortLabel: "Nap", caption: "They find a warm corner." },
        owned,
        unlocked,
        true,
      ),
    );
  }

  pie.push(
    slot(
      {
        itemId: "presence-gift",
        action: "gift",
        kind: "presence",
        label: "Give a parcel",
        shortLabel: "Parcel",
        caption: "A parcel appears. They investigate.",
        accent: "#E86B6B",
        icon: "gift",
        equip: {},
        skill: null,
        loops: false,
      },
      owned,
      unlocked,
      true,
    ),
  );

  if (climbAction) {
    pie.push(slot({ ...climbAction, label: "Climb", shortLabel: "Climb" }, owned, unlocked, true));
  }

  return pie.slice(0, 8);
}

/**
 * Radial for hero, studio, profile, and other live companion stages.
 */
export function wheelForCompanion(input: {
  species: SpeciesId;
  ownedItemIds?: Iterable<string>;
  unlockedSkills?: SkillId[];
  equipped?: EquipmentLoadout;
}): ResolvedWheelItem[] {
  return presencePieForCompanion(input);
}
