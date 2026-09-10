"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const HeroStage = dynamic(() => import("@/components/stage/HeroStage").then((mod) => mod.HeroStage), {
  ssr: false,
});

const beats = [
  {
    kicker: "Sillkin · screen companion",
    title: "A presence on the sill.",
    lede: "Hold the page. They lean in. A chunky little someone for the edge of the monitor — cute, cool, not a nursery toy.",
  },
  {
    kicker: "Squeeze the stress toy",
    title: "Click. They notice.",
    lede: "Cursor, scroll, a press — they squash like soft clay and bounce back. Built for teens, desks, late labs. All ages, no glitter.",
  },
  {
    kicker: "Three homes. Same nest.",
    title: "Keep them close.",
    lede: "Website first. Pin in a browser when IT is picky. Desktop later, if you want it. One companion, not three checkouts.",
  },
];

export function HeroBanner() {
  const [scroll, setScroll] = useState(0);
  const beat = scroll < 0.33 ? 0 : scroll < 0.66 ? 1 : 2;
  const copy = beats[beat];

  useEffect(() => {
    function onScroll() {
      const section = document.getElementById("hero-story");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const span = Math.max(1, section.offsetHeight - window.innerHeight);
      setScroll(Math.min(1, Math.max(0, -rect.top / span)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="hero-story" className="relative h-[240vh] bg-void text-mist">
      <div className="sticky top-0 isolate h-[100svh] overflow-hidden">
        <HeroStage scroll={scroll} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,9,0.8)_0%,rgba(7,8,9,0.22)_40%,transparent_64%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(7,8,9,0.5)_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay grain-layer" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-10 md:pb-24">
          <p className="text-[11px] uppercase tracking-[0.42em] text-mist/55">{copy.kicker}</p>
          <h1 className="mt-6 max-w-[14ch] font-display text-5xl leading-[0.9] text-paper md:text-8xl">{copy.title}</h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-mist/75 md:text-lg">{copy.lede}</p>
          <div className="pointer-events-auto mt-10 flex flex-wrap gap-3">
            <Link href="/companions/bloop" className="rounded-full bg-paper px-6 py-3 text-sm tracking-wide text-void">
              Meet Bloop
            </Link>
            <Link href="/live" className="rounded-full border border-mist/20 px-6 py-3 text-sm text-paper">
              Where they live
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
