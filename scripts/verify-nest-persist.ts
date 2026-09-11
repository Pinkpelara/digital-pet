import { claimAndEquip, grantItemsLocally, newCompanionInstance } from "../src/lib/state/grant-demo";
import { EMPTY_NEST, nestHasPossessions, type PersistedNest } from "../src/lib/state/storage";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function withKevin(equipped: PersistedNest["instances"][number]["equipped"] = {}): PersistedNest {
  const user = {
    id: "demo-user",
    email: "you@companions.local",
    displayName: "Explorer",
    publicId: "cmp-42",
    provider: "demo" as const,
  };
  const ownership = {
    id: "own-bloop",
    userId: user.id,
    itemId: "companion-bloop",
    source: "purchase" as const,
    grantedAt: "2026-01-01T00:00:00.000Z",
  };
  const kevin = {
    ...newCompanionInstance("bloop", ownership.id, user.id, "Kevin"),
    id: "kevin-1",
    createdAt: "2026-01-01T00:00:00.000Z",
    equipped,
  };
  return {
    user,
    ownership: [ownership],
    instances: [kevin],
    creaturesEnabled: true,
  };
}

function reload(nest: PersistedNest): PersistedNest {
  return JSON.parse(JSON.stringify(nest)) as PersistedNest;
}

const emptyGrant = grantItemsLocally(EMPTY_NEST, ["gadget-umbrella"], "purchase");
assert(emptyGrant.instances.length === 1, "granting a gadget should adopt Bloop");
assert(emptyGrant.instances[0].speciesId === "bloop", "default resident is Bloop");
assert(emptyGrant.instances[0].equipped.hand === "gadget-umbrella", "umbrella equips on grant");
assert(
  emptyGrant.ownership.some((row) => row.itemId === "gadget-umbrella"),
  "umbrella is owned",
);

const kevin = withKevin();
const afterUmbrella = grantItemsLocally(kevin, ["gadget-umbrella"], "purchase");
assert(afterUmbrella.instances[0].id === "kevin-1", "Kevin stays Kevin");
assert(afterUmbrella.instances[0].name === "Kevin", "Kevin keeps his name");
assert(afterUmbrella.instances[0].equipped.hand === "gadget-umbrella", "Kevin wears the umbrella");

const restored = reload(afterUmbrella);
assert(restored.instances[0].equipped.hand === "gadget-umbrella", "umbrella survives serialize/reload");

const noWipe = claimAndEquip(afterUmbrella, {});
assert(noWipe.instances[0].equipped.hand === "gadget-umbrella", "empty claim must not strip gear");

const coatThenUmbrella = grantItemsLocally(
  grantItemsLocally(kevin, ["outfit-raincoat"], "purchase"),
  ["gadget-umbrella"],
  "purchase",
);
assert(coatThenUmbrella.instances[0].equipped.body === "outfit-raincoat", "raincoat stays on");
assert(coatThenUmbrella.instances[0].equipped.hand === "gadget-umbrella", "umbrella stacks on another slot");

const ownedCoatOff: PersistedNest = {
  ...afterUmbrella,
  ownership: [
    ...afterUmbrella.ownership,
    {
      id: "own-coat",
      userId: "demo-user",
      itemId: "outfit-raincoat",
      source: "purchase",
      grantedAt: "2026-01-02T00:00:00.000Z",
    },
  ],
  instances: [{ ...afterUmbrella.instances[0], equipped: { hand: "gadget-umbrella" } }],
};
const buyCamera = grantItemsLocally(ownedCoatOff, ["gadget-camera"], "gift");
assert(buyCamera.instances[0].equipped.hand === "gadget-camera", "camera replaces the hand slot");
assert(buyCamera.instances[0].equipped.body === undefined, "unowned-on-body raincoat is not forced back on");

const twoUp: PersistedNest = {
  ...kevin,
  instances: [
    kevin.instances[0],
    {
      ...newCompanionInstance("mochi", "own-mochi", "demo-user", "Mochi"),
      id: "mochi-2",
      createdAt: "2026-06-01T00:00:00.000Z",
    },
  ],
};
const onHero = grantItemsLocally(twoUp, ["gadget-umbrella"], "purchase");
assert(onHero.instances[0].equipped.hand === "gadget-umbrella", "gear lands on the first roommate (hero)");
assert(!onHero.instances[1].equipped.hand, "newest roommate is not overwritten");

const claimed = claimAndEquip(EMPTY_NEST, { hand: "gadget-umbrella" });
assert(claimed.instances[0].equipped.hand === "gadget-umbrella", "try-on claims and equips");
assert(reload(claimed).instances[0].equipped.hand === "gadget-umbrella", "claimed umbrella survives reload");

assert(!nestHasPossessions(EMPTY_NEST), "empty nest has no possessions");
assert(nestHasPossessions(afterUmbrella), "Kevin with an umbrella has possessions");

console.log("nest persist checks passed");
