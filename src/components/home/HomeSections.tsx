"use client";

import { useState } from "react";
import Link from "next/link";
import { LiveStage } from "@/components/stage/LiveStage";
import { PlayableStage } from "@/components/stage/PlayableStage";
import { StageFx } from "@/components/stage/StageFx";
import { catalogById, companions } from "@/data/catalog";
import { applyTendencies, contrastLine, seedFromString } from "@/lib/personality";
import { FEATURED_SHOP_IDS } from "@/lib/catalog-paths";
import type { DemoActionId, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

function StageBox({
  species,
  equipped,
  skill,
  demo,
  mood,
  className = "aspect-[4/5]",
  playable = false,
  companionName,
  stageKey,
}: {
  species: SpeciesId;
  equipped?: EquipmentLoadout;
  skill?: SkillId | null;
  demo?: DemoActionId | null;
  mood?: "idle" | "nap" | "follow" | "climb" | "happy" | "hide";
  className?: string;
  playable?: boolean;
  companionName?: string;
  stageKey?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-[1.8rem] bg-cream ${className}`}>
      {playable ? (
        <PlayableStage
          key={stageKey}
          species={species}
          equipped={equipped}
          skill={skill}
          autoPlay={skill ?? demo ?? undefined}
          playAction={demo ?? skill ?? null}
          mood={mood}
          companionName={companionName}
          className="h-full min-h-[280px] w-full"
          cameraZ={5.6}
        />
      ) : (
        <div className="relative h-full min-h-[280px] w-full">
          <LiveStage
            species={species}
            equipped={equipped}
            skill={skill}
            demo={demo ?? skill ?? null}
            mood={mood}
            className="h-full min-h-[280px] w-full"
            cameraZ={5.6}
          />
          <StageFx demo={demo ?? skill ?? null} />
        </div>
      )}
    </div>
  );
}

export function TwinBloops() {
  const left = applyTendencies(seedFromString("twin-bloop-left"), companions[0].tendencies);
  const right = applyTendencies(seedFromString("twin-bloop-right"), companions[0].tendencies);

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
      <p className="text-sm font-medium text-moss">Same species. Different little weirdos.</p>
      <h2 className="mt-3 max-w-[16ch] font-display text-4xl text-ink md:text-5xl">
        Two Bloops. Completely different problems.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">
        Every companion gets a hidden personality when you adopt it. Same store page. Not the same
        creature.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <article>
          <StageBox species="bloop" mood="climb" />
          <h3 className="mt-4 font-display text-2xl text-ink">This one climbs first</h3>
          <p className="mt-2 text-sm text-ink-soft">
            Investigates the edge of the page. Falls. Climbs again.
          </p>
        </article>
        <article>
          <StageBox species="bloop" mood="nap" />
          <h3 className="mt-4 font-display text-2xl text-ink">This one waits</h3>
          <p className="mt-2 text-sm text-ink-soft">
            Checks for danger twice. Then takes a nap about it.
          </p>
        </article>
      </div>

      <p className="mt-8 font-display text-2xl text-ink">{contrastLine(left, right)}</p>
      <p className="mt-3 max-w-2xl text-ink-soft">
        You cannot buy, set, or edit any of this. You find out by living with them.
      </p>
      <Link href="/companions/bloop" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm text-paper">
        Meet Bloop
      </Link>
    </section>
  );
}

const tryLooks: Array<{
  id: string;
  label: string;
  equipped: EquipmentLoadout;
  skill: SkillId | null;
  demo: DemoActionId | null;
}> = [
  { id: "plain", label: "Just them", equipped: {}, skill: null, demo: null },
  { id: "coat", label: "Yellow raincoat", equipped: { body: "outfit-raincoat" }, skill: null, demo: null },
  { id: "umbrella", label: "Pocket umbrella", equipped: { body: "outfit-raincoat", hand: "gadget-umbrella" }, skill: null, demo: "rain-walk" },
];

export function MakeYoursDemo() {
  const [look, setLook] = useState(tryLooks[1]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
      <p className="text-sm font-medium text-moss">In the shop now</p>
      <h2 className="mt-3 max-w-[16ch] font-display text-4xl text-ink md:text-5xl">
        Dress it. Hand it an umbrella.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">
        Shop line: Yellow Raincoat · Pocket Umbrella. If you cannot see it in a second, we do not sell it.
      </p>
      <div className="mt-10 grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <StageBox
          stageKey={look.id}
          species="bloop"
          equipped={look.equipped}
          skill={look.skill}
          demo={look.demo}
          playable
          companionName="Bloop"
          className="min-h-[420px] md:min-h-[520px]"
        />
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
          <p className="mt-6 text-ink-soft">
            {look.id === "umbrella"
              ? "An umbrella means rain-walks. Gadgets change what they do, not who they are."
              : look.id === "coat"
                ? "A raincoat is just a raincoat. Personality stays hidden."
                : "Same Bloop. You have not met the individual yet."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {FEATURED_SHOP_IDS.map((id, index) => {
              const item = catalogById.get(id);
              if (!item) return null;
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
                  Add {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ThingsChange() {
  const [on, setOn] = useState(true);
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
      <p className="text-sm font-medium text-moss">Things change what they do</p>
      <h2 className="mt-3 max-w-[16ch] font-display text-4xl text-ink md:text-5xl">
        Umbrella on. Now it rain-walks.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">
        A raincoat is a silhouette. An umbrella is a walk. Personality is not for sale.
      </p>
      <div className="mt-10 grid items-center gap-8 md:grid-cols-2">
        <StageBox
          species="bloop"
          equipped={on ? { body: "outfit-raincoat", hand: "gadget-umbrella" } : { body: "outfit-raincoat" }}
          demo={on ? "rain-walk" : null}
          mood="idle"
        />
        <div>
          <button
            type="button"
            onClick={() => setOn((prev) => !prev)}
            className="rounded-full bg-ink px-6 py-3 text-sm text-paper"
          >
            {on ? "Close the umbrella" : "Open the umbrella"}
          </button>
          <p className="mt-5 text-ink-soft">
            {on ? "Same Bloop. Wetter priorities." : "Same Bloop. Coat still on."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/item/pocket-umbrella" className="text-sm text-moss underline underline-offset-4">
              Add Pocket Umbrella
            </Link>
            <Link href="/item/yellow-raincoat" className="text-sm text-moss underline underline-offset-4">
              Add Yellow Raincoat
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TheyNotice() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
      <p className="text-sm font-medium text-moss">They notice each other</p>
      <h2 className="mt-3 max-w-[16ch] font-display text-4xl text-ink md:text-5xl">
        Two in a room is not two solos.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">
        They peek, copy, or nap in the same corner. Full roommate behaviour is still a preview — you
        can already keep more than one.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <StageBox species="sprout" mood="follow" equipped={{ back: "gadget-balloon" }} />
        <StageBox species="mochi" mood="nap" equipped={{ body: "outfit-hoodie" }} />
      </div>
    </section>
  );
}

export function SomethingHappened() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
      <p className="text-sm font-medium text-moss">Something happened while you were gone</p>
      <h2 className="mt-3 max-w-[16ch] font-display text-4xl text-ink md:text-5xl">
        They keep secrets. You find them later.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">
        Hidden habits stay hidden until you live with them. No paying to unlock a personality. The
        ??? stay ??? until they do not.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {["??? still undiscovered", "??? still undiscovered", "??? still undiscovered"].map((line, index) => (
          <li key={index} className="rounded-[1.4rem] bg-cream px-5 py-6 text-ink-soft">
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TinyProblem() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
      <p className="text-sm font-medium text-moss">Send someone a tiny problem</p>
      <h2 className="mt-3 max-w-[16ch] font-display text-4xl text-ink md:text-5xl">
        A gift is a parcel. Then it is their problem.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">
        No social network. You send a code. They open a box. Someone new moves in.
      </p>
      <Link
        href="/gift/TINY-PROBLEM"
        className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm text-paper"
      >
        Open a sample gift
      </Link>
    </section>
  );
}

export function LetLoose() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
      <p className="text-sm font-medium text-moss">Lives in the corner while you work</p>
      <h2 className="mt-3 max-w-[16ch] font-display text-4xl text-ink md:text-5xl">
        Pin the browser today. Desktop roaming comes later.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">
        The real now-path on a work machine is a pinned browser window — they sit in the corner
        while you write. A full OS desktop app is coming. We are not pretending it exists.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/browser" className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
          Add to browser
        </Link>
        <Link href="/desktop" className="rounded-full border border-ink/15 px-6 py-3 text-sm text-ink">
          Desktop, honestly
        </Link>
      </div>
    </section>
  );
}
