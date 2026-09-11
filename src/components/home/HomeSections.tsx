"use client";

import { useState } from "react";
import Link from "next/link";
import { LiveStage } from "@/components/stage/LiveStage";
import { PlayableStage } from "@/components/stage/PlayableStage";
import { StageFx } from "@/components/stage/StageFx";
import { CareChips } from "@/components/home/CareChips";
import { DayVignette } from "@/components/home/DayVignette";
import { catalogById, companions } from "@/data/catalog";
import { applyTendencies, contrastLine, seedFromString } from "@/lib/personality";
import { FEATURED_SHOP_IDS } from "@/lib/catalog-paths";
import { brand } from "@/lib/brand";
import type { DemoActionId, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

function StageBox({
  species,
  equipped,
  skill,
  demo,
  mood,
  sulk = false,
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
  sulk?: boolean;
  className?: string;
  playable?: boolean;
  companionName?: string;
  stageKey?: string;
  loop?: boolean;
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
            sulk={sulk}
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
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
      <p className="text-sm font-medium text-moss">Same species. Different little weirdos.</p>
      <h2 className="mt-3 max-w-[16ch] font-display text-4xl text-ink md:text-5xl">
        Two Bloops. Completely different problems.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">{brand.meetBody}</p>

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
        Adopt one
      </Link>
    </section>
  );
}

type ToyLook = {
  id: string;
  label: string;
  equipped: EquipmentLoadout;
  skill: SkillId | null;
  demo: DemoActionId | null;
  line: string;
};

const tryLooks: ToyLook[] = [
  {
    id: "coat",
    label: "Raincoat",
    equipped: { body: "outfit-raincoat" },
    skill: null,
    demo: null,
    line: "A raincoat is a shape. Visible in a second.",
  },
  {
    id: "board",
    label: "Skateboard",
    equipped: { feet: "gadget-skateboard" },
    skill: null,
    demo: "skate",
    line: "Click the board. They skate.",
  },
  {
    id: "moonwalk",
    label: "Moonwalk",
    equipped: { face: "outfit-sunglasses" },
    skill: "moonwalk",
    demo: "moonwalk",
    line: "Moonwalk. Backward, smooth, slightly illegal.",
  },
];

const takenBack: ToyLook = {
  id: "plain",
  label: "Take it back",
  equipped: {},
  skill: null,
  demo: null,
  line: "Same creature. The toy is off.",
};

export function MakeYoursDemo() {
  const [look, setLook] = useState<ToyLook>(tryLooks[0]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
      <p className="text-sm font-medium text-moss">Shop</p>
      <h2 className="mt-3 max-w-[16ch] font-display text-4xl text-ink md:text-5xl">
        Raincoat. Skateboard. Moonwalk.
      </h2>
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
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
      <p className="text-sm font-medium text-moss">If you cannot see it in a second, it is not a gadget</p>
      <h2 className="mt-3 max-w-[16ch] font-display text-4xl text-ink md:text-5xl">
        Umbrella on. Now it rain-walks.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">
        Silhouette or motion in under a second — or we do not sell it. A raincoat is a shape. An
        umbrella is a walk. Personality is not for sale.
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
      <p className="text-sm font-medium text-moss">Always-there path</p>
      <h2 className="mt-3 max-w-[16ch] font-display text-4xl text-ink md:text-5xl">
        Pin the browser. They stay in the corner.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">
        The real now-path on a work machine is a pinned browser window — they sit in the corner
        while you write. Happy-Dog energy: always there, never a second job. A full OS desktop app
        is a stub until it exists. We are not selling a robot body.
      </p>
      <p className="mt-3 max-w-xl text-ink-soft">
        Mute chaos is one tap. Goose-mode is an opt-in Teach, never the default. They sulk when
        ignored. They do not die.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/browser" className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
          Pin the browser
        </Link>
        <Link href="/desktop" className="rounded-full border border-ink/15 px-6 py-3 text-sm text-ink">
          Desktop stub
        </Link>
      </div>
    </section>
  );
}

export function LiveYourDay() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
      <p className="text-sm font-medium text-moss">Free magic</p>
      <h2 className="mt-3 max-w-[18ch] font-display text-4xl text-ink md:text-5xl">
        They notice your day. Birthday cake appears before you remember.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">{brand.freeMagicBody}</p>
      <CareChips className="mt-6" />

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
