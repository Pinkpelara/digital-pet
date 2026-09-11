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
    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(onReady, { timeout: 900 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }
    const timeoutId = window.setTimeout(onReady, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden bg-paper">
      <div className="pointer-events-none absolute inset-y-0 -right-[12%] w-[72%] max-md:inset-x-[-8%] max-md:top-[28%] max-md:h-[58%] max-md:w-auto">
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
          <div className="absolute inset-0 bg-cream" />
        )}
      </div>

      <div className="pointer-events-none relative z-20 mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-center px-5 py-16 md:px-10 md:py-24">
        <p className="text-sm font-medium text-moss">{brand.tagline}</p>
        <h1 className="relative mt-4 max-w-[14ch] font-display text-4xl leading-[0.98] text-ink md:text-6xl">
          {headline}
          <span className="headline-peek pointer-events-none absolute -right-10 -top-6 hidden md:block" aria-hidden>
            <Creature species="niblet" size={72} mood="climb" decorative equipped={{ face: "outfit-sunglasses" }} />
          </span>
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">{brand.heroSub}</p>
        <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
          <Link href="/companions" className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
            Adopt from {adoptFrom}
          </Link>
          <Link href="/companions/bloop" className="rounded-full border border-ink/15 bg-paper px-6 py-3 text-sm text-ink">
            Adopt one
          </Link>
        </div>
        <p className="mt-5 max-w-md text-sm text-ink-soft">{brand.heroSupport}</p>
        <p className="pointer-events-auto mt-2 max-w-md text-sm text-ink-soft">
          They never vanish from neglect. Mute the chaos anytime.{" "}
          <Link href="/browser" className="underline underline-offset-4">
            Pin the browser
          </Link>
          {playable.sulk ? " They’re waiting." : ""}
        </p>
      </div>

      <div
        className={`absolute inset-y-[18%] right-0 w-[42%] max-md:inset-x-0 max-md:top-[54%] max-md:h-[40%] max-md:w-auto ${
          playable.open ? "z-40" : "z-20"
        }`}
      >
        <button
          type="button"
          className={`absolute inset-0 cursor-pointer bg-transparent ${playable.open ? "pointer-events-none" : ""}`}
          onClick={playable.toggleWheel}
          aria-label="Open Bloop’s gadgets and skills"
          aria-expanded={playable.open}
        />
        <ActionWheel
          items={playable.wheel}
          open={playable.open}
          onSelect={playable.play}
          onClose={playable.closeWheel}
          name="Bloop"
        />
        <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-ink/75 px-3 py-1 text-xs text-paper max-md:bottom-3">
          {playable.demo ? playable.caption : playable.sulk ? "They’re waiting." : "Click them."}
        </p>
      </div>
    </section>
  );
}
