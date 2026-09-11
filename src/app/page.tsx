import Link from "next/link";
import { adoptFromCents } from "@/data/catalog";
import { brand } from "@/lib/brand";
import { formatPrice } from "@/lib/format";
import { HeroBanner } from "@/components/stage/HeroBanner";
import { HomeProductJsonLd } from "@/components/store/ProductJsonLd";
import { KineticTitle } from "@/components/site/KineticTitle";
import { PersonalityCards } from "@/components/home/PersonalityCards";
import {
  LetLoose,
  LiveYourDay,
  MakeYoursDemo,
  SendAGift,
  SomethingHappened,
  TheyNotice,
  ThingsChange,
  TwinBloops,
} from "@/components/home/HomeSections";

export default function HomePage() {
  const adoptFrom = formatPrice(adoptFromCents());
  return (
    <div className="bg-paper">
      <HomeProductJsonLd />
      <HeroBanner />

      <div className="below-fold">
        <section id="meet" className="px-0 py-16">
          <div className="mx-auto max-w-6xl px-5 md:px-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="kicker">Meet</p>
                <KineticTitle as="h2" className="mt-3 text-4xl text-ink md:text-6xl">
                  Four species. Live.
                </KineticTitle>
              </div>
              <Link href="/companions" className="text-sm text-moss underline underline-offset-4">
                See all
              </Link>
            </div>
            <p className="mt-4 max-w-xl text-ink-soft">{brand.meetBody}</p>
            <p className="mt-2 max-w-xl text-ink-soft">{brand.heroSupport}</p>
          </div>
          <div className="mx-auto mt-10 max-w-6xl px-5 md:px-10">
            <PersonalityCards featured />
          </div>
        </section>

        <TwinBloops />
        <LiveYourDay />
        <TheyNotice />
        <SomethingHappened />
        <SendAGift />
        <LetLoose />
        <MakeYoursDemo />
        <ThingsChange />
      </div>

      <section className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-28 pt-12 text-center md:px-10">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-blush/20 blur-3xl" />
        <KineticTitle as="h2" className="text-5xl text-ink md:text-7xl">
          Adopt one
        </KineticTitle>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">{brand.meetBody}</p>
        <p className="mx-auto mt-2 max-w-lg text-ink-soft">{brand.heroSupport}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/companions/bloop" className="inline-block rounded-full bg-ink px-7 py-3.5 text-paper">
            Adopt from {adoptFrom}. Start with Bloop.
          </Link>
        </div>
      </section>
    </div>
  );
}
