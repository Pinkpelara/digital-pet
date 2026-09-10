export type SpeciesId = "bloop" | "mochi" | "sprout" | "niblet";

export type ItemKind =
  | "companion"
  | "outfit"
  | "gadget"
  | "skill"
  | "personality"
  | "drop";

export type EquipSlot = "head" | "face" | "body" | "hand" | "back" | "feet";

export type SkillId =
  | "moonwalk"
  | "cartwheel"
  | "climb"
  | "dance"
  | "hide"
  | "juggle"
  | "skate"
  | "nap";

export type PersonalityId =
  | "chaotic"
  | "dramatic"
  | "sleepy"
  | "shy"
  | "clingy"
  | "explorer";

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

export type PersonalityStats = {
  chaos: number;
  drama: number;
  energy: number;
  shy: number;
  cling: number;
  curiosity: number;
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
  personalityId?: PersonalityId;
  speciesId?: SpeciesId;
  limited?: boolean;
  limitedNote?: string;
  unlocksBehavior?: string;
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
  tagline: string;
  description: string;
  priceCents: number;
  traits: string[];
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
  stats: PersonalityStats;
  equipped: Partial<Record<EquipSlot, string>>;
  unlockedSkills: SkillId[];
  personalityPacks: PersonalityId[];
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
  | "gift_redeemed";
