"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const HeroStage = dynamic(() => import("@/components/stage/HeroStage").then((mod) => mod.HeroStage), {
  ssr: false,
});

export function HeroBanner() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-void text-mist">
      <HeroStage />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_circle_at_70%_40%,transparent_0%,#0a0b0c_72%)]" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:px-10 md:pb-20">
        <p className="text-[11px] uppercase tracking-[0.42em] text-mist/70">Sillkin · screen companions</p>
        <h1 className="mt-5 max-w-[18ch] font-display text-5xl leading-[0.92] text-paper md:text-8xl">
          A presence on the sill.
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-mist/80 md:text-lg">
          Adopt a figurine that lives in your nest — on the website, pinned in a browser, or later on the desktop. No
          installer required.
        </p>
        <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
          <Link href="/companions/bloop" className="rounded-full bg-paper px-6 py-3 text-sm text-void">
            Meet Bloop
          </Link>
          <Link href="/live" className="rounded-full border border-mist/25 px-6 py-3 text-sm text-paper">
            Where they live
          </Link>
        </div>
      </div>
    </section>
  );
}
