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
                <p className="kicker">Meet them</p>
                <KineticTitle as="h2" className="mt-3 text-4xl text-ink md:text-6xl">
                  Four little weirdos looking for a screen.
                </KineticTitle>
              </div>
              <Link href="/companions" prefetch={false} className="text-sm text-moss underline underline-offset-4">
                See all
              </Link>
            </div>
            <p className="mt-4 max-w-xl text-ink-soft">
              They climb things, nap on things, follow your cursor and sit on buttons they
              shouldn&apos;t. That one is asleep right now. We didn&apos;t ask him to be.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-6xl px-5 md:px-10">
            <DeferredMeet />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
          <p className="kicker">Their stuff</p>
          <KineticTitle as="h2" className="mt-4 max-w-[16ch] text-4xl text-ink md:text-6xl">
            Things change what they do.
          </KineticTitle>
          <p className="mt-4 max-w-xl text-ink-soft">
            A skateboard means he skates. A camera means he takes photos, mostly of the floor.
            A ball means play. Gadgets are not decorations — they are new things your companion
            can do.
          </p>
          <div className="mt-10">
            <DeferredTheirStuff />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-10">
          <p className="kicker">Yours</p>
          <KineticTitle as="h2" className="mt-4 max-w-[18ch] text-4xl text-ink md:text-6xl">
            Same species. Never the same one.
          </KineticTitle>
          <p className="mt-4 max-w-xl text-ink-soft">
            Every companion is born with a hidden personality. Yours might climb everything and
            fear nothing. Someone else&apos;s might nap all day and hide from the cursor. You
            don&apos;t choose who they are. You meet them.
          </p>
          <p className="mt-6">
            <Link href="/my-companions" prefetch={false} className="text-sm text-moss underline underline-offset-4">
              Your companions live here
            </Link>
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-10">
          <p className="kicker">While you&apos;re away</p>
          <KineticTitle as="h2" className="mt-4 max-w-[18ch] text-4xl text-ink md:text-6xl">
            Something happened while you were gone.
          </KineticTitle>
          <p className="mt-4 max-w-xl text-ink-soft">
            He knocked the plant over. Looked at you. Denied it. Rare things only happen when
            nobody is watching — and when one does, you get a card, because nobody will believe
            you otherwise.
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
          <p className="kicker">The dream</p>
          <KineticTitle as="h2" className="mt-4 max-w-[18ch] text-4xl text-ink md:text-6xl">
            Eventually, let them loose.
          </KineticTitle>
          <p className="mt-4 max-w-xl text-ink-soft">
            The website is their first home. Then your browser. Then your whole desktop — same
            companion, same tricks, same history. He goes where you go. Not yet, though.
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
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          Name it. Watch who shows up. Yours forever — no feeding schedules, no guilt. He
          doesn&apos;t die. He just lives with you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span data-creature-spot="adopt" className="inline-block">
            <Link href="/companions/bloop" prefetch={false} className="inline-block rounded-full bg-ink px-7 py-3.5 text-paper">
              Adopt from {adoptFrom}. Start with Bloop.
            </Link>
          </span>
        </div>
      </section>
    </div>
  );
}
