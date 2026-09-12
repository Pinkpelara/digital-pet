import { brand } from "@/lib/brand";
import { adoptFromCents } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { HeroAdoptLink } from "@/components/stage/HeroAdoptLink";
import { HeroBackdrop } from "@/components/stage/HeroBackdrop";

export function HeroBanner() {
  const adoptFrom = formatPrice(adoptFromCents());

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-void">
      <HeroBackdrop />
      <div aria-hidden className="hero-vignette pointer-events-none absolute inset-0 z-10" />
      <div aria-hidden className="grain-layer pointer-events-none absolute inset-0 z-10 opacity-[0.12] mix-blend-overlay" />

      <div className="pointer-events-none relative z-20 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-24 md:justify-center md:px-10 md:pb-24 md:pt-20">
        <p className="kicker">{brand.tagline}</p>
        <h1
          data-creature-peek
          className="hero-headline relative mt-5 max-w-[11ch] text-5xl leading-[0.9] text-ink md:text-7xl lg:text-[5.4rem]"
        >
          {brand.heroHeadline}
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">{brand.heroSub}</p>
        <div data-creature-spot="adopt" className="pointer-events-auto mt-8 flex flex-wrap gap-3">
          <HeroAdoptLink adoptFrom={adoptFrom} />
        </div>
      </div>
    </section>
  );
}
