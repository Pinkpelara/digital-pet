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
        <p className="text-[11px] uppercase tracking-[0.42em] text-mist/55">
          Tiny creatures that live with you
        </p>
        <h1 className="mt-6 max-w-[14ch] font-display text-5xl leading-[0.9] text-paper md:text-8xl">
          A tiny creature that lives on your screen.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-mist/75 md:text-lg">
          Adopt one. Give it a name. Dress it, teach it tricks, and discover who it turns out to be.
          No two grow up exactly alike.
        </p>
        <div className="pointer-events-auto mt-10 flex flex-wrap gap-3">
          <Link href="/companions" className="rounded-full bg-paper px-6 py-3 text-sm tracking-wide text-void">
            Meet the companions
          </Link>
          <Link href="/live" className="rounded-full border border-mist/20 px-6 py-3 text-sm text-paper">
            See how they live
          </Link>
        </div>
        <p className="mt-6 max-w-md text-sm text-mist/55">
          You do not choose its personality. You meet it.
        </p>
      </div>
    </section>
  );
}
