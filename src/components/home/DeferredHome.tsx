"use client";

import dynamic from "next/dynamic";
import { IdleMount } from "@/components/site/IdleMount";
import { WhenVisible } from "@/components/site/WhenVisible";

const PersonalityCards = dynamic(
  () => import("@/components/home/PersonalityCards").then((mod) => mod.PersonalityCards),
  { ssr: false },
);

const MakeYoursDemo = dynamic(
  () => import("@/components/home/HomeSections").then((mod) => mod.MakeYoursDemo),
  { ssr: false },
);

function MeetFallback() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-hidden>
      {["bloop", "mochi", "sprout", "niblet"].map((id) => (
        <div key={id} className="aspect-[4/5] rounded-[1.6rem] bg-cream" />
      ))}
    </div>
  );
}

function StuffFallback() {
  return <div className="min-h-[460px] rounded-[1.8rem] bg-cream md:min-h-[560px]" aria-hidden />;
}

/** Meet grid — four R3F posters, only after first paint and near the viewport. */
export function DeferredMeet() {
  return (
    <IdleMount delay={1600}>
      <WhenVisible once rootMargin="40px" fallback={<MeetFallback />}>
        <PersonalityCards featured />
      </WhenVisible>
    </IdleMount>
  );
}

/** Their-stuff try-on — one extra canvas, well after the hero. */
export function DeferredTheirStuff() {
  return (
    <IdleMount delay={2200}>
      <WhenVisible once rootMargin="40px" fallback={<StuffFallback />}>
        <MakeYoursDemo />
      </WhenVisible>
    </IdleMount>
  );
}
