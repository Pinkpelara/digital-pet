"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LiveStage } from "@/components/stage/LiveStage";
import { StageFx } from "@/components/stage/StageFx";
import { grantBalloonBunch, hasBalloonBunch } from "@/lib/state/presence";
import { useClientMounted } from "@/lib/state/use-client-mounted";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import type { DemoActionId, EquipmentLoadout } from "@/lib/types";

const BEATS: Array<{
  id: string;
  label: string;
  body: string;
  demo: DemoActionId;
  equipped: EquipmentLoadout;
  ms: number;
}> = [
  {
    id: "focus",
    label: "Deep work / homework",
    body: "Headphones on. They settle when you settle.",
    demo: "focus",
    equipped: { head: "gadget-headphones" },
    ms: 3500,
  },
  {
    id: "stretch",
    label: "Long afternoon",
    body: "They notice the slump. One big stretch about it.",
    demo: "stretch",
    equipped: {},
    ms: 3500,
  },
  {
    id: "adventure",
    label: "Evening walk",
    body: "Sometimes they wander off on their own. They come back with a sticker. You did not send them.",
    demo: "adventure",
    equipped: { face: "outfit-sunglasses" },
    ms: 3500,
  },
  {
    id: "party",
    label: "Birthday",
    body: "Party hat + confetti. Balloon Bunch is free for 24 hours around a birthday.",
    demo: "party",
    equipped: { head: "gadget-partyhat", back: "gadget-balloon" },
    ms: 4000,
  },
];

/** ~14s loop: focus → stretch → adventure sticker → birthday hat + Balloon Bunch. */
export function DayVignette() {
  const reduce = useReducedMotion();
  const mounted = useClientMounted();
  const [index, setIndex] = useState(0);
  const beat = BEATS[index] ?? BEATS[0];
  const birthdayUnlocked = mounted && hasBalloonBunch();

  useEffect(() => {
    if (reduce) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => {
        const next = (current + 1) % BEATS.length;
        if (BEATS[next]?.id === "party") grantBalloonBunch();
        return next;
      });
    }, beat.ms);
    return () => window.clearTimeout(timer);
  }, [beat.ms, index, reduce]);

  return (
    <div>
      <div className="relative min-h-[380px] overflow-hidden rounded-[1.8rem] bg-cream stage-frame md:min-h-[480px]">
        <LiveStage
          species="bloop"
          demo={beat.demo}
          equipped={beat.equipped}
          loop
          followPointer={false}
          quality="medium"
          className="h-full min-h-[380px] w-full md:min-h-[480px]"
          cameraZ={5.5}
        />
        <StageFx demo={beat.demo} />
        <p className="stage-caption">{beat.label}</p>
      </div>
      <ol className="mt-6 grid gap-3 sm:grid-cols-2">
        {BEATS.map((entry, beatIndex) => (
          <li
            key={entry.id}
            className={`rounded-[1.2rem] px-4 py-3 ${
              beatIndex === index ? "bg-ink text-paper" : "bg-cream text-ink"
            }`}
          >
            <p className="font-display text-xl">{entry.label}</p>
            <p className={`mt-1 text-sm ${beatIndex === index ? "text-paper/80" : "text-ink-soft"}`}>{entry.body}</p>
          </li>
        ))}
      </ol>
      {birthdayUnlocked ? (
        <p className="mt-4 text-sm text-moss">
          Balloon Bunch is unlocked for 24 hours.{" "}
          <Link href="/item/balloon-bunch" className="underline underline-offset-4">
            See the trick
          </Link>
          {" · "}
          <Link href="/item/party-hat" className="underline underline-offset-4">
            Party Hat
          </Link>
        </p>
      ) : null}
    </div>
  );
}
