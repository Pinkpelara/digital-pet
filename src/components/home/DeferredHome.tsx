"use client";

import { useEffect, useState, type ComponentType } from "react";
import { IdleMount } from "@/components/site/IdleMount";
import { WhenVisible } from "@/components/site/WhenVisible";

function MeetFallback() {
  return <div className="min-h-[340px] rounded-[1.8rem] bg-cream md:min-h-[420px]" aria-hidden />;
}

function StuffFallback() {
  return <div className="min-h-[460px] rounded-[1.8rem] bg-cream md:min-h-[560px]" aria-hidden />;
}

function LazyMeet() {
  const [Lineup, setLineup] = useState<ComponentType | null>(null);

  useEffect(() => {
    void import("@/components/home/MeetLineup").then((mod) => {
      setLineup(() => mod.MeetLineup);
    });
  }, []);

  if (!Lineup) return <MeetFallback />;
  return <Lineup />;
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

/** Meet lineup — one living canvas, only after LCP and when the section is on screen. */
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
