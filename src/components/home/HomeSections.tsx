"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayableStage } from "@/components/stage/PlayableStage";
import { catalogById } from "@/data/catalog";
import { FEATURED_SHOP_IDS } from "@/lib/catalog-paths";
import { brand } from "@/lib/brand";
import { KineticTitle } from "@/components/site/KineticTitle";
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

export function MakeYoursDemo() {
  const [look, setLook] = useState<StageLook>(tryLooks[0]);
  const nest = useNest();
  const roommate = nest.instances[0] ?? null;

  function giveCamera() {
    nest.signInDemo();
    nest.grantItems(["gadget-camera"], "gift");
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
      <p className="kicker">Their stuff</p>
      <KineticTitle as="h2" className="mt-4 max-w-[16ch] text-4xl text-ink md:text-6xl">
        Try it on. It’s theirs.
      </KineticTitle>
      <p className="mt-4 max-w-xl text-ink-soft">{brand.shopBody}</p>
      <div className="mt-10 grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
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
          />
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            {tryLooks.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setLook(entry)}
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
          <div className="mt-6">
            {nest.owns("gadget-camera") ? (
              <p className="text-sm text-moss">The camera is theirs.</p>
            ) : (
              <button
                type="button"
                onClick={giveCamera}
                className="text-sm text-moss underline underline-offset-4"
              >
                {brand.cameraLine}
              </button>
            )}
          </div>
          <p className="mt-4">
            <Link href="/item/focus-headphones" className="text-sm text-ink-soft underline underline-offset-4">
              Focus Headphones
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
