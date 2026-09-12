import Link from "next/link";
import { adoptFromCents } from "@/data/catalog";
import { brand } from "@/lib/brand";
import { formatPrice } from "@/lib/format";
import { HeroBanner } from "@/components/stage/HeroBanner";
import { HomeProductJsonLd } from "@/components/store/ProductJsonLd";
import { KineticTitle } from "@/components/site/KineticTitle";
import { DeferredMeet, DeferredTheirStuff } from "@/components/home/DeferredHome";

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
                  Who’s this
                </KineticTitle>
              </div>
              <Link href="/companions" prefetch={false} className="text-sm text-moss underline underline-offset-4">
                See all
              </Link>
            </div>
            <p className="mt-4 max-w-xl text-ink-soft">{brand.meetBody}</p>
          </div>
          <div className="mx-auto mt-10 max-w-6xl px-5 md:px-10">
            <DeferredMeet />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
          <p className="kicker">Their stuff</p>
          <KineticTitle as="h2" className="mt-4 max-w-[16ch] text-4xl text-ink md:text-6xl">
            Try it on. It’s theirs.
          </KineticTitle>
          <p className="mt-4 max-w-xl text-ink-soft">{brand.shopBody}</p>
          <div className="mt-10">
            <DeferredTheirStuff />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-10">
          <p className="kicker">Individuals</p>
          <KineticTitle as="h2" className="mt-4 max-w-[18ch] text-4xl text-ink md:text-6xl">
            Same species. Different little weirdos.
          </KineticTitle>
          <p className="mt-4 max-w-xl text-ink-soft">
            Two Bloops. Completely different problems. Every companion gets its own hidden
            personality. You don&apos;t choose it. You meet it.
          </p>
          <p className="mt-6">
            <Link href="/my-companions" prefetch={false} className="text-sm text-moss underline underline-offset-4">
              Your companions live here
            </Link>
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-10">
          <p className="kicker">Gadgets</p>
          <KineticTitle as="h2" className="mt-4 max-w-[18ch] text-4xl text-ink md:text-6xl">
            Things change what they do.
          </KineticTitle>
          <p className="mt-4 max-w-xl text-ink-soft">
            A gadget is not a hat with a strap. Give him the skateboard and he skates. Give him
            the camera and he takes photos. Mostly of nothing.
          </p>
          <p className="mt-6 flex flex-wrap gap-4">
            <Link href="/gadgets" prefetch={false} className="text-sm text-moss underline underline-offset-4">
              All gadgets
            </Link>
            <Link href="/skills" prefetch={false} className="text-sm text-moss underline underline-offset-4">
              Teach Moonwalk
            </Link>
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-10">
          <p className="kicker">Elsewhere</p>
          <KineticTitle as="h2" className="mt-4 max-w-[18ch] text-4xl text-ink md:text-6xl">
            Something happened while you were gone.
          </KineticTitle>
          <p className="mt-4 max-w-xl text-ink-soft">
            He knocked the plant over. Rare things only happen when nobody is watching. When one
            does, you get a card — because nobody will believe you otherwise.
          </p>
          <p className="mt-6 flex flex-wrap gap-4">
            <Link href="/live" prefetch={false} className="text-sm text-moss underline underline-offset-4">
              Where they live
            </Link>
            <Link href="/gift/WELCOME-BLOOP" prefetch={false} className="text-sm text-moss underline underline-offset-4">
              Send someone a tiny problem
            </Link>
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-10">
          <p className="kicker">Desktop</p>
          <KineticTitle as="h2" className="mt-4 max-w-[18ch] text-4xl text-ink md:text-6xl">
            Eventually, let them loose.
          </KineticTitle>
          <p className="mt-4 max-w-xl text-ink-soft">
            Your desktop is the real home. Not yet, though. The website is where you meet them,
            dress them, and figure out who you got.
          </p>
          <p className="mt-6">
            <Link href="/desktop" prefetch={false} className="text-sm text-moss underline underline-offset-4">
              Read what exists
            </Link>
          </p>
        </section>
      </div>

      <section className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-28 pt-12 text-center md:px-10">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-blush/20 blur-3xl" />
        <KineticTitle as="h2" className="text-5xl text-ink md:text-7xl">
          Adopt one
        </KineticTitle>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">{brand.meetBody}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/companions/bloop" prefetch={false} className="inline-block rounded-full bg-ink px-7 py-3.5 text-paper">
            Adopt from {adoptFrom}. Start with Bloop.
          </Link>
        </div>
      </section>
    </div>
  );
}
