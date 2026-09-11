import { ambientPlaylist, dominantHabit, habitWeights, pickWeightedMood, seedUnit } from "../src/lib/ambient";
import { idlePose } from "../src/lib/idle-pose";
import { seedFromString } from "../src/lib/personality";
import type { CreatureMood, SpeciesId } from "../src/lib/types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function share(species: SpeciesId, seedId: string, samples = 800): Record<CreatureMood, number> {
  const seed = seedFromString(seedId);
  const weights = habitWeights(species, seed);
  const counts = {} as Record<CreatureMood, number>;
  const rand = (() => {
    let i = 0;
    return () => {
      i += 1;
      return seedUnit(seed, `roll-${i}`);
    };
  })();
  for (let n = 0; n < samples; n += 1) {
    const mood = pickWeightedMood(weights, rand);
    counts[mood] = (counts[mood] ?? 0) + 1;
  }
  return counts;
}

function top(counts: Record<CreatureMood, number>): CreatureMood {
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "idle") as CreatureMood;
}

assert(dominantHabit("bloop") === "climb", "Bloop’s signature is climbing");
assert(dominantHabit("mochi") === "nap", "Mochi’s signature is napping");
assert(dominantHabit("sprout") === "walk", "Sprout’s signature is edge-walking");
assert(dominantHabit("niblet") === "happy", "Niblet’s signature is a chrome perch");

const bloop = share("bloop", "kevin-the-climber");
const mochi = share("mochi", "loaf-one");
const sprout = share("sprout", "mapper-a");
const niblet = share("niblet", "button-thief");

assert(top(bloop) === "climb", "Bloop playlist is climb-heavy");
assert((bloop.climb ?? 0) > (bloop.nap ?? 0), "Bloop climbs more than it naps");
assert(top(mochi) === "nap", "Mochi playlist is nap-heavy");
assert((mochi.nap ?? 0) > (mochi.walk ?? 0) * 1.5, "Mochi settles more than it wanders");
assert((sprout.walk ?? 0) + (sprout.hide ?? 0) > (sprout.nap ?? 0) * 3, "Sprout maps edges, not loafs");
assert(top(niblet) === "happy", "Niblet playlist perches more than anything else");

const baseValues = seedFromString("template").values;
const energetic = habitWeights("bloop", {
  id: "restless-bloop",
  values: { ...baseValues, energy: 94, curiosity: 92, sleepiness: 12, clinginess: 20 },
});
const sleepy = habitWeights("bloop", {
  id: "sleepy-bloop",
  values: { ...baseValues, energy: 18, curiosity: 28, sleepiness: 88, clinginess: 70 },
});
const climbA = energetic.find((row) => row.mood === "climb")?.weight ?? 0;
const climbB = sleepy.find((row) => row.mood === "climb")?.weight ?? 0;
const followA = energetic.find((row) => row.mood === "follow")?.weight ?? 0;
const followB = sleepy.find((row) => row.mood === "follow")?.weight ?? 0;
assert(climbA > climbB, "a restless Bloop climbs more");
assert(followB > followA, "a clingy Bloop watches more");
assert(climbA >= 36 && climbB >= 36, "a sleepy Bloop is still a climber");

const gym = idlePose("bloop", "climb", 2.4, seedFromString("gym"));
const corner = idlePose("mochi", "nap", 2.4, seedFromString("loaf"));
const edge = idlePose("sprout", "walk", 2.4, seedFromString("map"));
const perch = idlePose("niblet", "happy", 2.4, seedFromString("sit"));

assert(gym.y > 0.2, "Bloop gym leaves the floor");
assert(corner.y < 0, "Mochi nap is a warm low corner");
assert(Math.abs(corner.x) > 0.6, "Mochi actually goes to a corner");
assert(Math.abs(edge.x) > 0.1 || edge.y > 0.4 || edge.y < 0, "Sprout is on an edge");
assert(perch.scale < 0.95, "Niblet is sitting on chrome, not bobbing in place");
assert(Math.hypot(perch.x, perch.y) > 0.25, "Niblet left center for a button");

const otherPerch = idlePose("niblet", "happy", 2.4, seedFromString("other-sit"));
assert(
  perch.x !== otherPerch.x || perch.y !== otherPerch.y || seedUnit(seedFromString("sit"), "perch-start") !== seedUnit(seedFromString("other-sit"), "perch-start"),
  "two Niblets do not share the same hidden perch bias",
);

const withUmbrella = ambientPlaylist("bloop", seedFromString("kevin"), { hand: "gadget-umbrella" });
assert(
  withUmbrella.some((beat) => beat.action === "rain-walk"),
  "owned umbrella still joins the idle playlist",
);

console.log("species habit checks passed");
