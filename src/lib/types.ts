export type SpeciesId = "bloop" | "mochi" | "sprout" | "niblet";

export type ItemKind = "companion" | "outfit" | "gadget" | "skill" | "drop";

export type EquipSlot = "head" | "face" | "body" | "hand" | "back" | "feet";

export type SkillId =
  | "moonwalk"
  | "cartwheel"
  | "climb"
  | "dance"
  | "hide"
  | "juggle"
  | "skate"
  | "nap"
  | "focus"
  | "balloon-bunch"
  | "chaos";

/** On-stage demo played from the live-pet radial wheel. Includes skills + gadget behaviours. */
export type DemoActionId =
  | SkillId
  | "rain-walk"
  | "photo-pose"
  | "hover"
  | "tidy"
  | "twirl"
  | "mood-peek"
  | "gift"
  | "study"
  | "mad"
  | "stretch"
  | "adventure"
  | "party";

export type CreatureMood =
  | "idle"
  | "walk"
  | "nap"
  | "follow"
  | "climb"
  | "happy"
  | "hide"
  | "skill";

export type AuthProvider = "google" | "apple" | "magic-link" | "demo";

/** Internal behaviour engine numbers. Never rendered to a user. */
export type PersonalityStats = {
  chaos: number;
  drama: number;
  energy: number;
  shy: number;
  cling: number;
  curiosity: number;
};

/**
 * The hidden personality of one adopted companion instance.
 * Species set the tendencies; the seed decides the individual.
 */
export type TraitKey =
  | "curiosity"
  | "courage"
  | "clinginess"
  | "sleepiness"
  | "sociability"
  | "mischief"
  | "energy"
  | "drama";

export type PersonalitySeed = {
  /** Stable id, also used to reproduce the same individual. */
  id: string;
  values: Record<TraitKey, number>;
};

export type PersonalityLabel =
  | "Curious"
  | "Cowardly"
  | "Brave"
  | "Clingy"
  | "Sleepy"
  | "Restless"
  | "Dramatic"
  | "Chaotic"
  | "Shy"
  | "Friendly"
  | "Nosy"
  | "Show-off";

export type DiscoveredTrait = {
  label: PersonalityLabel;
  at: string;
};

/** Behaviours observed while living together. Drives discovery + share cards. */
export type BehaviourCounters = Partial<
  Record<
    | "climbed"
    | "napped"
    | "followedCursor"
    | "fell"
    | "hid"
    | "skated"
    | "photographed"
    | "played"
    | "explored",
    number
  >
>;

export type CompanionBond = {
  otherInstanceId: string;
  kind: "curious-about" | "napping-together" | "partners-in-crime";
  strength: number;
};

export type CompanionSecret = {
  id: string;
  at: string;
};

export type CatalogItem = {
  id: string;
  sku: string;
  slug: string;
  kind: ItemKind;
  name: string;
  tagline: string;
  description: string;
  priceCents: number;
  currency: "usd";
  slot?: EquipSlot;
  skillId?: SkillId;
  speciesId?: SpeciesId;
  limited?: boolean;
  limitedNote?: string;
  /** Plain-language promise of what the object changes about behaviour. */
  unlocksBehavior?: string;
  /** Short line shown on the "things change what they do" rail. */
  behaviorNote?: string;
  /**
   * Shop-gate: only true when the live demo shows a silhouette or motion change in under a second.
   * False means try-on/preview only — no checkout until the trick is obvious.
   */
  shopSafe?: boolean;
  looksGoodWith: string[];
  compatibleSpecies?: SpeciesId[];
  accent: string;
  riveSrc?: string;
  active: boolean;
};

export type CompanionSpecies = {
  id: SpeciesId;
  slug: string;
  name: string;
  itemId: string;
  title: string;
  /** One funny, specific line. Not poetry. */
  tagline: string;
  /** Roster poster name — attitude, not a shop SKU. */
  alias: string;
  description: string;
  priceCents: number;
  traits: string[];
  /** Behaviours everyone notices eventually. */
  knownHabits: string[];
  /** The one thing this species does without being taught. */
  nativeTalent: string;
  /** Hidden behaviours. Count shown; names stay secret until found. */
  secrets: string[];
  /** Broad species tendencies applied on top of the individual seed. */
  tendencies: Partial<Record<TraitKey, number>>;
  defaultStats: PersonalityStats;
  nativeSkills: SkillId[];
  accent: string;
  belly: string;
  shade: string;
  highlight: string;
  riveSrc?: string;
};

export type OwnershipRecord = {
  id: string;
  userId: string;
  itemId: string;
  source: "purchase" | "gift" | "demo" | "admin";
  stripeEventId?: string;
  grantedAt: string;
};

export type CompanionInstance = {
  id: string;
  userId: string;
  speciesId: SpeciesId;
  ownershipId: string;
  name: string;
  publicId: string;
  /** Hidden. Never shown as numbers, never editable. */
  seed: PersonalitySeed;
  /** Derived from the seed for the behaviour engine only. */
  stats: PersonalityStats;
  equipped: Partial<Record<EquipSlot, string>>;
  unlockedSkills: SkillId[];
  discovered: DiscoveredTrait[];
  counters: BehaviourCounters;
  secrets: CompanionSecret[];
  favouriteSpot: string | null;
  bonds: CompanionBond[];
  createdAt: string;
};

export type Discovery = {
  id: string;
  userId: string;
  instanceId: string;
  kind: string;
  note: string;
  createdAt: string;
};

export type Relationship = {
  id: string;
  leftInstanceId: string;
  rightInstanceId: string;
  kind: "roommates" | "curious-about" | "napping-together";
  strength: number;
};

export type ItemCompatibility = {
  itemId: string;
  otherItemId: string;
  note: string;
};

export type DemoUser = {
  id: string;
  email: string;
  displayName: string;
  publicId: string;
  provider: AuthProvider;
};

export type EquipmentLoadout = Partial<Record<EquipSlot, string>>;

export type CheckoutRequest = {
  itemIds: string[];
  successPath?: string;
  cancelPath?: string;
};

export type CheckoutSessionShape = {
  id: string;
  object: "checkout.session";
  mode: "payment";
  currency: "usd";
  status: "open" | "complete";
  success_url: string;
  cancel_url: string;
  client_reference_id: string;
  metadata: {
    userId: string;
    itemIds: string;
    demo: string;
  };
  line_items: Array<{
    quantity: number;
    price_data: {
      currency: "usd";
      unit_amount: number;
      product_data: {
        name: string;
        metadata: { itemId: string; sku: string; kind: ItemKind };
      };
    };
  }>;
};

export type AnalyticsEventName =
  | "page_view"
  | "companion_preview"
  | "item_try_on"
  | "skill_performed"
  | "checkout_started"
  | "purchase_granted"
  | "outfit_saved"
  | "companion_named"
  | "creatures_paused"
  | "desktop_deeplink_clicked"
  | "home_path_chosen"
  | "pwa_install_prompted"
  | "auth_started"
  | "gift_redeemed"
  | "personality_revealed"
  | "clip_shared"
  | "action_wheel_opened"
  | "demo_played"
  | "birthday_opened";
