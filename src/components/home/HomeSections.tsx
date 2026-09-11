"use client";

import { useState } from "react";
import Link from "next/link";
import { LiveStage } from "@/components/stage/LiveStage";
import { PairedStage } from "@/components/stage/PairedStage";
import { PlayableStage } from "@/components/stage/PlayableStage";
import { StageFx } from "@/components/stage/StageFx";
import { DayVignette } from "@/components/home/DayVignette";
import { catalogById, companions } from "@/data/catalog";
import { applyTendencies, contrastLine, seedFromString } from "@/lib/personality";
import { FEATURED_SHOP_IDS } from "@/lib/catalog-paths";
import { brand } from "@/lib/brand";
import { KineticTitle } from "@/components/site/KineticTitle";
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
  loop = false,
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
  loop?: boolean;
}) {
  return (
    <div className={`stage-frame overflow-hidden rounded-[1.8rem] ${className}`}>
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
          quality="medium"
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
            followPointer={false}
            quality="medium"
            loop={loop}
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
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
      <p className="kicker">Meet</p>
      <KineticTitle as="h2" className="mt-4 max-w-[14ch] text-4xl text-ink md:text-6xl">
        {brand.closer}
      </KineticTitle>
      <p className="mt-4 max-w-xl text-ink-soft">Two Bloops. Completely different problems.</p>
      <p className="mt-2 max-w-xl text-ink-soft">{brand.heroSupport}</p>

      <div className="mt-12">
        <article className="poster-card rounded-[1.7rem]">
          <div className="min-h-[360px] md:min-h-[520px]">
            <PairedStage
              left={{ species: "bloop", mood: "climb" }}
              right={{ species: "bloop", mood: "nap" }}
              className="min-h-[360px] md:min-h-[520px]"
            />
          </div>
          <div className="film-wash" aria-hidden />
          <div className="poster-copy grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-moss">THE CLIMBER</p>
              <h3 className="mt-1 font-display text-4xl leading-none text-ink">Edge first</h3>
              <p className="mt-2 text-sm text-ink-soft">Investigates the edge of the page. Falls. Climbs again.</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-gold">THE LOAFER</p>
              <h3 className="mt-1 font-display text-4xl leading-none text-ink">Nap theory</h3>
              <p className="mt-2 text-sm text-ink-soft">Checks for danger twice. Then takes a nap about it.</p>
            </div>
          </div>
        </article>
        <div className="mt-8 max-w-2xl">
          <p className="font-display text-3xl leading-tight text-ink md:text-4xl">{contrastLine(left, right)}</p>
          <p className="mt-4 text-ink-soft">
            You cannot buy, set, or edit any of this. You find out by living with them.
          </p>
          <Link href="/companions/bloop" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm text-paper">
            Adopt one
          </Link>
        </div>
      </div>
    </section>
  );
}

type StageLook = {
  id: string;
  label: string;
  equipped: EquipmentLoadout;
  skill: SkillId | null;
  demo: DemoActionId | null;
  line: string;
};

const tryLooks: StageLook[] = [
  {
    id: "coat",
    label: "Raincoat",
    equipped: { body: "outfit-raincoat" },
    skill: null,
    demo: null,
    line: "A raincoat changes how they look.",
  },
  {
    id: "umbrella",
    label: "Pocket Umbrella",
    equipped: { hand: "gadget-umbrella" },
    skill: null,
    demo: "rain-walk",
    line: "An umbrella changes how they walk.",
  },
];

const takenBack: StageLook = {
  id: "plain",
  label: "Take it back",
  equipped: {},
  skill: null,
  demo: null,
  line: "Same companion. Gear off.",
};

export function MakeYoursDemo() {
  const [look, setLook] = useState<StageLook>(tryLooks[0]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
      <p className="kicker">Shop</p>
      <KineticTitle as="h2" className="mt-4 max-w-[16ch] text-4xl text-ink md:text-6xl">
        Raincoat · Pocket Umbrella
      </KineticTitle>
      <p className="mt-4 max-w-xl text-ink-soft">{brand.shopBody}</p>
      <div className="mt-10 grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <StageBox
          stageKey={look.id}
          species="bloop"
          equipped={look.equipped}
          skill={look.skill}
          demo={look.demo}
          playable
          companionName="Bloop"
          className="min-h-[460px] md:min-h-[560px]"
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
          <p className="mt-6 text-ink-soft">{look.line}</p>
          <button
            type="button"
            onClick={() => setLook(takenBack)}
            className="mt-4 rounded-full border border-ink/15 px-4 py-2 text-sm text-ink"
          >
            Take it back
          </button>
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
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
      <p className="kicker">Gadgets</p>
      <KineticTitle as="h2" className="mt-4 max-w-[16ch] text-4xl text-ink md:text-6xl">
        Umbrella on. Now it rain-walks.
      </KineticTitle>
      <p className="mt-4 max-w-xl text-ink-soft">
        Everything in the shop changes something you can see: how they look or how they move. A
        raincoat is a shape. An umbrella is a walk.
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
            {on ? "Take it back" : "Open the umbrella"}
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
            <Link href="/gadgets" className="text-sm text-moss underline underline-offset-4">
              Gadget showreel
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TheyNotice() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
      <p className="kicker">Live with you</p>
      <KineticTitle as="h2" className="mt-4 max-w-[16ch] text-4xl text-ink md:text-6xl">
        Two in a room is not two solos.
      </KineticTitle>
      <p className="mt-4 max-w-xl text-ink-soft">
        They peek, copy, or nap in the same corner. Two of them is more fun than one — this part is
        still early, but you can already adopt more than one.
      </p>
      <div className="stage-frame mt-10 overflow-hidden rounded-[1.8rem]">
        <PairedStage
          left={{ species: "sprout", mood: "follow", equipped: { back: "gadget-balloon" } }}
          right={{ species: "mochi", mood: "nap", equipped: { body: "outfit-hoodie" } }}
          className="min-h-[340px] md:min-h-[420px]"
        />
      </div>
    </section>
  );
}

export function SomethingHappened() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
      <p className="kicker">Live with you</p>
      <KineticTitle as="h2" className="mt-4 max-w-[16ch] text-4xl text-ink md:text-6xl">
        They keep secrets. You find them later.
      </KineticTitle>
      <p className="mt-4 max-w-xl text-ink-soft">
        Hidden habits stay hidden until you live with them. None of this is for sale. You find it by
        watching. The ??? stay ??? until they do not.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {["??? still undiscovered", "??? still undiscovered", "??? still undiscovered"].map((line, index) => (
          <li key={index} className="rounded-[1.4rem] bg-mist px-5 py-8 text-ink-soft ring-1 ring-ink/10">
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SendAGift() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
      <p className="kicker">Live with you</p>
      <KineticTitle as="h2" className="mt-4 max-w-[16ch] text-4xl text-ink md:text-6xl">
        A gift is a parcel. Then it is their problem.
      </KineticTitle>
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
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
      <p className="kicker">Live with you</p>
      <KineticTitle as="h2" className="mt-4 max-w-[16ch] text-4xl text-ink md:text-6xl">
        Pin the browser. They stay in the corner.
      </KineticTitle>
      <p className="mt-4 max-w-xl text-ink-soft">
        Pin this site in Chrome or Edge and they sit in the corner while you work. No install,
        nothing for IT to approve. You write, they nap. You look back, they noticed.
      </p>
      <p className="mt-3 max-w-xl text-ink-soft">
        A desktop app that lets them roam your whole screen is coming later. Nothing bad happens
        while you are away.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/browser" className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
          Pin the browser
        </Link>
        <Link href="/desktop" className="rounded-full border border-ink/15 px-6 py-3 text-sm text-ink">
          Desktop app — coming soon
        </Link>
      </div>
    </section>
  );
}

export function LiveYourDay() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
      <p className="kicker">Live with you</p>
      <KineticTitle as="h2" className="mt-4 max-w-[18ch] text-4xl text-ink md:text-6xl">
        They notice your day. Birthday cake appears before you remember.
      </KineticTitle>
      <p className="mt-4 max-w-xl text-ink-soft">{brand.freeMagicBody}</p>

      <div className="mt-10">
        <DayVignette />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/companions" className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
          Adopt one
        </Link>
        <Link href="/browser" className="rounded-full border border-ink/15 px-6 py-3 text-sm text-ink">
          Pin the browser
        </Link>
      </div>
    </section>
  );
}
