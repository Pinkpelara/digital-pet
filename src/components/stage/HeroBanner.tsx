"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Creature } from "@/components/creatures/Creature";
import { brand } from "@/lib/brand";

const HeroStage = dynamic(() => import("@/components/stage/HeroStage").then((mod) => mod.HeroStage), {
  ssr: false,
});

export function HeroBanner() {
  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden bg-paper">
      <div className="pointer-events-none absolute inset-y-0 -right-[12%] w-[72%] max-md:inset-x-[-8%] max-md:top-[28%] max-md:h-[58%] max-md:w-auto">
        <HeroStage />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-center px-5 py-16 md:px-10 md:py-24">
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
      </div>
    </section>
  );
}
