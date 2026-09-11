"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ActionWheel } from "@/components/stage/ActionWheel";
import { Creature } from "@/components/creatures/Creature";
import { StageFx } from "@/components/stage/StageFx";
import { usePlayableCompanion } from "@/components/stage/use-playable-companion";
import { brand } from "@/lib/brand";
import { adoptFromCents } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

const HeroStage = dynamic(() => import("@/components/stage/HeroStage").then((mod) => mod.HeroStage), {
  ssr: false,
});

export function HeroBanner() {
  const playable = usePlayableCompanion({ species: "bloop" });
  const [stageReady, setStageReady] = useState(false);
  const headline = brand.heroHeadline;
  const adoptFrom = formatPrice(adoptFromCents());

  useEffect(() => {
    let cancelled = false;
    const onReady = () => {
      if (!cancelled) setStageReady(true);
    };
    let idleId = 0;
    let timeoutId = 0;
    const raf = window.requestAnimationFrame(() => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(onReady, { timeout: 280 });
        return;
      }
      timeoutId = window.setTimeout(onReady, 120);
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-void">
      <div className="absolute inset-0">
        {stageReady ? (
          <>
            <HeroStage
              mood={playable.mood}
              skill={playable.skill}
              demo={playable.demo}
              sulk={playable.sulk}
              equipped={playable.equipped}
            />
            <StageFx demo={playable.demo} />
          </>
        ) : (
          <div className="absolute inset-0 bg-void" />
        )}
      </div>
      <div aria-hidden className="hero-vignette pointer-events-none absolute inset-0 z-10" />
      <div aria-hidden className="grain-layer pointer-events-none absolute inset-0 z-10 opacity-[0.12] mix-blend-overlay" />

      <div className="pointer-events-none relative z-20 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-24 md:justify-center md:px-10 md:pb-24 md:pt-20">
        <p className="kicker">{brand.tagline}</p>
        <h1 className="relative mt-5 max-w-[11ch] font-display text-5xl leading-[0.9] text-ink md:text-7xl lg:text-[5.4rem]">
          {headline}
          <span className="headline-peek pointer-events-none absolute -right-8 -top-8 hidden md:block" aria-hidden>
            <Creature species="niblet" size={72} mood="climb" decorative equipped={{ face: "outfit-sunglasses" }} />
          </span>
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">{brand.heroSub}</p>
        <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
          <Link href="/companions/bloop" className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
            Adopt from {adoptFrom}. Start with Bloop.
          </Link>
        </div>
        <p className="mt-5 max-w-md text-sm text-ink-soft">{brand.heroSupport}</p>
        <p className="pointer-events-auto mt-2 max-w-md text-sm text-ink-soft">
          They never vanish from neglect. Mute the chaos anytime.{" "}
          <Link href="/browser" className="underline underline-offset-4">
            Pin the browser
          </Link>
          {playable.sulk ? ". They’re waiting." : "."}
        </p>
      </div>

      <div
        className={`absolute inset-y-[12%] right-0 w-[58%] max-md:inset-x-0 max-md:top-[38%] max-md:h-[52%] max-md:w-auto ${
          playable.open ? "z-40" : "z-20"
        }`}
      >
        <button
          type="button"
          className={`absolute inset-0 cursor-pointer bg-transparent ${playable.open ? "pointer-events-none" : ""}`}
          onClick={playable.toggleWheel}
          aria-label="Open Bloop’s Moonwalk, Skateboard, and gadgets"
          aria-expanded={playable.open}
        />
        <ActionWheel
          items={playable.wheel}
          open={playable.open}
          onSelect={playable.play}
          onClose={playable.closeWheel}
          name="Bloop"
        />
        <p className="stage-caption max-md:bottom-4">
          {playable.demo ? playable.caption : playable.sulk ? "They’re waiting." : "Move. Click them."}
        </p>
      </div>
    </section>
  );
}
