"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ActionWheel } from "@/components/stage/ActionWheel";
import { StageFx } from "@/components/stage/StageFx";
import { usePlayableCompanion } from "@/components/stage/use-playable-companion";
import { brand } from "@/lib/brand";
import { adoptFromCents } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { profileHref } from "@/lib/catalog-paths";
import { useNest } from "@/lib/state/nest-context";

const HeroStage = dynamic(() => import("@/components/stage/HeroStage").then((mod) => mod.HeroStage), {
  ssr: false,
});

export function HeroBanner() {
  const nest = useNest();
  const roommate = nest.hydrated ? nest.instances[0] : null;
  const species = roommate?.speciesId ?? "bloop";
  const playable = usePlayableCompanion({
    species,
    equipped: roommate?.equipped,
    unlockedSkills: roommate?.unlockedSkills,
    instanceId: roommate?.id,
    seed: roommate?.seed,
    persistEquip: Boolean(roommate),
  });
  const [stageReady, setStageReady] = useState(false);
  const adoptFrom = formatPrice(adoptFromCents());
  const name = roommate?.name ?? "Bloop";

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
              species={species}
              mood={playable.mood}
              skill={playable.skill}
              demo={playable.demo}
              sulk={false}
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
          {brand.heroHeadline}
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">{brand.heroSub}</p>
        <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
          {roommate ? (
            <Link href={profileHref(roommate.id)} className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
              {name} is here
            </Link>
          ) : (
            <Link href="/companions/bloop" className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
              Adopt from {adoptFrom}. Start with Bloop.
            </Link>
          )}
        </div>
      </div>

      <div
        className={`absolute inset-y-[12%] right-0 w-[58%] max-md:inset-x-0 max-md:top-[38%] max-md:h-[52%] max-md:w-auto ${
          playable.open ? "z-40" : "z-20"
        }`}
      >
        <button
          type="button"
          className={`absolute inset-0 cursor-pointer bg-transparent ${playable.open ? "pointer-events-none" : ""}`}
          onClick={playable.pat}
          aria-label={`Pat ${name}`}
        />
        <button
          type="button"
          className="absolute bottom-6 right-6 z-30 rounded-full bg-ink/80 px-3 py-1.5 text-xs text-paper"
          onClick={playable.toggleWheel}
          aria-expanded={playable.open}
        >
          Tricks
        </button>
        <ActionWheel
          items={playable.wheel}
          open={playable.open}
          onSelect={playable.play}
          onClose={playable.closeWheel}
          name={name}
        />
      </div>
    </section>
  );
}
