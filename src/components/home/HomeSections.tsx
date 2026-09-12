"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayableStage } from "@/components/stage/PlayableStage";
import { catalogById } from "@/data/catalog";
import { FEATURED_SHOP_IDS } from "@/lib/catalog-paths";
import { useNest } from "@/lib/state/nest-context";
import type { DemoActionId, EquipmentLoadout, SkillId } from "@/lib/types";

type StageLook = {
  id: string;
  label: string;
  equipped: EquipmentLoadout;
  skill: SkillId | null;
  demo: DemoActionId | null;
};

const tryLooks: StageLook[] = [
  {
    id: "coat",
    label: "Raincoat",
    equipped: { body: "outfit-raincoat" },
    skill: null,
    demo: null,
  },
  {
    id: "umbrella",
    label: "Umbrella",
    equipped: { hand: "gadget-umbrella" },
    skill: null,
    demo: "rain-walk",
  },
  {
    id: "skate",
    label: "Skateboard",
    equipped: { feet: "gadget-skateboard" },
    skill: null,
    demo: "skate",
  },
  {
    id: "moonwalk",
    label: "Moonwalk",
    equipped: {},
    skill: "moonwalk",
    demo: "moonwalk",
  },
];

function lookFromEquipped(equipped: EquipmentLoadout | undefined): StageLook | undefined {
  if (!equipped) return undefined;
  if (equipped.hand === "gadget-umbrella") return tryLooks.find((entry) => entry.id === "umbrella");
  if (equipped.feet === "gadget-skateboard") return tryLooks.find((entry) => entry.id === "skate");
  if (equipped.body === "outfit-raincoat") return tryLooks.find((entry) => entry.id === "coat");
  return undefined;
}

export function MakeYoursDemo() {
  const [picked, setPicked] = useState<StageLook | null>(null);
  const nest = useNest();
  const roommate = nest.instances[0] ?? null;
  const look = picked ?? (nest.hydrated ? lookFromEquipped(roommate?.equipped) : undefined) ?? tryLooks[0];

  function chooseLook(entry: StageLook) {
    setPicked(entry);
    if (Object.keys(entry.equipped).length > 0) {
      nest.claimAndEquip(entry.equipped);
    }
  }

  return (
    <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="stage-frame min-h-[460px] overflow-hidden rounded-[1.8rem] md:min-h-[560px]">
          <PlayableStage
            key={look.id}
            species={roommate?.speciesId ?? "bloop"}
            equipped={look.equipped}
            skill={look.skill}
            autoPlay={look.demo}
            playAction={look.demo}
            companionName={roommate?.name ?? "Bloop"}
            instanceId={roommate?.id}
            seed={roommate?.seed}
            persistEquip
            className="h-full min-h-[460px] w-full md:min-h-[560px]"
            cameraZ={5.6}
            quality="medium"
            dprMax={1}
          />
        </div>
        <div>
          <p className="text-sm text-ink-soft">Try a look on this one. Dressing them changes how they look. Gadgets and skills change what they get up to on their own.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tryLooks.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => chooseLook(entry)}
                className={`rounded-full px-4 py-2 text-sm ${
                  look.id === entry.id ? "bg-ink text-paper" : "border border-ink/15 bg-paper text-ink"
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {FEATURED_SHOP_IDS.map((id, index) => {
              const item = catalogById.get(id);
              if (!item) return null;
              const owned = nest.owns(item.id);
              return (
                <Link
                  key={id}
                  href={`/item/${item.slug}`}
                  className={
                    index === 0
                      ? "inline-block rounded-full bg-ink px-6 py-3 text-sm text-paper"
                      : "inline-block rounded-full border border-ink/15 px-6 py-3 text-sm text-ink"
                  }
                >
                  {owned ? `Owned · ${item.name}` : `Try ${item.name}`}
                </Link>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-moss">Give him the skateboard and he skates. Take it away and he mimes it, sadly.</p>
        </div>
      </div>
  );
}
