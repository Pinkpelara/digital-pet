"use client";

import { useState } from "react";
import Link from "next/link";
import { LiveStage } from "@/components/stage/LiveStage";
import { companions } from "@/data/catalog";
import { applyTendencies, contrastLine, seedFromString } from "@/lib/personality";
import type { EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

function StageBox({
  species,
  equipped,
  skill,
  mood,
  className = "aspect-[4/5]",
}: {
  species: SpeciesId;
  equipped?: EquipmentLoadout;
  skill?: SkillId | null;
  mood?: "idle" | "nap" | "follow" | "climb" | "happy" | "hide";
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-[1.8rem] bg-cream ${className}`}>
      <LiveStage
        species={species}
        equipped={equipped}
        skill={skill}
        mood={mood}
        className="h-full min-h-[280px] w-full"
        cameraZ={5.6}
      />
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
}> = [
  { id: "plain", label: "Just them", equipped: {}, skill: null },
  { id: "coat", label: "Yellow raincoat", equipped: { body: "outfit-raincoat" }, skill: null },
  { id: "board", label: "Skateboard", equipped: { feet: "gadget-skateboard" }, skill: "skate" },
  { id: "walk", label: "Teach moonwalk", equipped: { face: "outfit-sunglasses" }, skill: "moonwalk" },
];

export function MakeYoursDemo() {
  const [look, setLook] = useState(tryLooks[1]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
      <p className="text-sm font-medium text-moss">Make yours yours</p>
      <h2 className="mt-3 max-w-[16ch] font-display text-4xl text-ink md:text-5xl">
        Dress it. Hand it a gadget. Teach it a trick.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">
        Try it on this Bloop. Nothing is saved until you adopt one.
      </p>
      <div className="mt-10 grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <StageBox species="bloop" equipped={look.equipped} skill={look.skill} className="min-h-[420px] md:min-h-[520px]" />
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
            {look.id === "board"
              ? "A skateboard means skating. Gadgets change what they do, not who they are."
              : look.id === "walk"
                ? "Skills are things you teach. This one walks backward and looks very sure about it."
                : look.id === "coat"
                  ? "A raincoat is just a raincoat. Personality stays hidden."
                  : "Same Bloop. You have not met the individual yet."}
          </p>
          <Link href="/companions/bloop" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm text-paper">
            Adopt Bloop and keep a look
          </Link>
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
        Skateboard on. Now it skates.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">
        An umbrella means rain-walks. A broom means pointless sweeping. Personality is not for sale.
      </p>
      <div className="mt-10 grid items-center gap-8 md:grid-cols-2">
        <StageBox
          species="niblet"
          equipped={on ? { feet: "gadget-skateboard", face: "outfit-sunglasses" } : {}}
          skill={on ? "skate" : null}
          mood={on ? "happy" : "idle"}
        />
        <div>
          <button
            type="button"
            onClick={() => setOn((prev) => !prev)}
            className="rounded-full bg-ink px-6 py-3 text-sm text-paper"
          >
            {on ? "Take the board away" : "Give Niblet the board"}
          </button>
          <p className="mt-5 text-ink-soft">
            {on ? "Showing off. Obviously." : "Just standing there. Worse, somehow."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/gadgets" className="text-sm text-moss underline underline-offset-4">
              See gadgets
            </Link>
            <Link href="/skills" className="text-sm text-moss underline underline-offset-4">
              Teach a skill
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
      <p className="text-sm font-medium text-moss">Eventually let them loose</p>
      <h2 className="mt-3 max-w-[16ch] font-display text-4xl text-ink md:text-5xl">
        Desktop roaming is coming. It is not here yet.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">
        Today they live on this website. You can add the page to a browser. Walking across your
        whole computer is the flagship — and we are not pretending the app exists.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/live" className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
          Where they live today
        </Link>
        <Link href="/desktop" className="rounded-full border border-ink/15 px-6 py-3 text-sm text-ink">
          Desktop, honestly
        </Link>
      </div>
    </section>
  );
}
