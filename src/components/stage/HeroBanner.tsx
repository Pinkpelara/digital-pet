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
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,9,0.78)_0%,rgba(7,8,9,0.28)_38%,transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(7,8,9,0.55)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay grain-layer" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-10 md:pb-24">
        <p className="text-[11px] uppercase tracking-[0.42em] text-mist/55">Sillkin · vinyl presence</p>
        <h1 className="mt-6 max-w-[14ch] font-display text-5xl leading-[0.9] text-paper md:text-8xl">
          A presence on the sill.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-mist/75 md:text-lg">
          Soft-volume companions that live at the edge of the screen. Adopt one. Keep it on the website, pin it in a
          browser, or bring it to the desktop later.
        </p>
        <div className="pointer-events-auto mt-10 flex flex-wrap gap-3">
          <Link href="/companions/bloop" className="rounded-full bg-paper px-6 py-3 text-sm tracking-wide text-void">
            Meet Bloop
          </Link>
          <Link href="/live" className="rounded-full border border-mist/20 px-6 py-3 text-sm text-paper">
            Where they live
          </Link>
        </div>
      </div>
    </section>
  );
}
