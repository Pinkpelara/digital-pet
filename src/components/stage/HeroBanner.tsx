"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ActionWheel } from "@/components/stage/ActionWheel";
import { Creature } from "@/components/creatures/Creature";
import { StageFx } from "@/components/stage/StageFx";
import { usePlayableCompanion } from "@/components/stage/use-playable-companion";
import { brand } from "@/lib/brand";

const HeroStage = dynamic(() => import("@/components/stage/HeroStage").then((mod) => mod.HeroStage), {
  ssr: false,
});

export function HeroBanner() {
  const playable = usePlayableCompanion({ species: "bloop" });

  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden bg-paper">
      <div className="pointer-events-none absolute inset-y-0 -right-[12%] w-[72%] max-md:inset-x-[-8%] max-md:top-[28%] max-md:h-[58%] max-md:w-auto">
        <HeroStage
          mood={playable.mood}
          skill={playable.skill}
          demo={playable.demo}
          sulk={playable.sulk}
          equipped={playable.equipped}
        />
        <StageFx demo={playable.demo} />
      </div>

      <div className="relative z-20 mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-center px-5 py-16 md:px-10 md:py-24">
        <p className="text-sm font-medium text-moss">{brand.tagline}</p>
        <h1 className="relative mt-4 max-w-[14ch] font-display text-5xl leading-[0.95] text-ink md:text-7xl">
          A tiny creature that lives on your screen.
          <span className="headline-peek pointer-events-none absolute -right-10 -top-6 hidden md:block" aria-hidden>
            <Creature species="niblet" size={72} mood="climb" decorative equipped={{ face: "outfit-sunglasses" }} />
          </span>
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
          Adopt one. Give it a name. Dress it, teach it tricks, and discover who it turns out to be.
          No two grow up exactly alike.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/companions" className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
            Meet the companions
          </Link>
          <Link href="#how-they-live" className="rounded-full border border-ink/15 bg-paper px-6 py-3 text-sm text-ink">
            See how they live
          </Link>
        </div>
        <p className="mt-5 max-w-md text-sm text-ink-soft">You do not choose its personality. You meet it.</p>
        <p className="mt-2 max-w-md text-sm text-ink-soft">
          They sit in the corner while you work.{" "}
          <Link href="/browser" className="underline underline-offset-4">
            Pin the browser
          </Link>
          {playable.sulk ? " They’re waiting." : ""}
        </p>
      </div>

      <div className={`absolute inset-y-[18%] right-0 w-[42%] max-md:inset-x-0 max-md:top-[54%] max-md:h-[40%] max-md:w-auto ${playable.open ? "z-30" : "z-10 max-md:z-20"}`}>
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
          {playable.demo ? playable.caption : playable.sulk ? "They’re waiting." : "Tap Bloop for tricks."}
        </p>
      </div>
    </section>
  );
}
