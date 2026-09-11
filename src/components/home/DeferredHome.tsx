"use client";

import { useEffect, useState, type ComponentType } from "react";
import { IdleMount } from "@/components/site/IdleMount";
import { WhenVisible } from "@/components/site/WhenVisible";

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

function LazyMeet() {
  const [Cards, setCards] = useState<ComponentType<{ featured?: boolean }> | null>(null);

  useEffect(() => {
    void import("@/components/home/PersonalityCards").then((mod) => {
      setCards(() => mod.PersonalityCards);
    });
  }, []);

  if (!Cards) return <MeetFallback />;
  return <Cards featured />;
}

function LazyStuff() {
  const [Demo, setDemo] = useState<ComponentType | null>(null);

  useEffect(() => {
    void import("@/components/home/HomeSections").then((mod) => {
      setDemo(() => mod.MakeYoursDemo);
    });
  }, []);

  if (!Demo) return <StuffFallback />;
  return <Demo />;
}

/** Meet grid — four R3F posters, only after LCP and when the section is on screen. */
export function DeferredMeet() {
  return (
    <IdleMount delay={3600}>
      <WhenVisible once rootMargin="0px" fallback={<MeetFallback />}>
        <LazyMeet />
      </WhenVisible>
    </IdleMount>
  );
}

/** Their-stuff try-on — one extra canvas, well after the hero hydrates. */
export function DeferredTheirStuff() {
  return (
    <IdleMount delay={4800}>
      <WhenVisible once rootMargin="0px" fallback={<StuffFallback />}>
        <LazyStuff />
      </WhenVisible>
    </IdleMount>
  );
}
