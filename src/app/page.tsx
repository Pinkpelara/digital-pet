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
        <section className="border-b border-ink/10 bg-cream/60">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-3 md:px-10">
            <div>
              <p className="text-sm font-semibold tabular-nums text-moss">1 · Adopt</p>
              <h3 className="mt-2 font-display text-2xl text-ink">Open the parcel. Name them.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Pick a species from $5.99. A parcel arrives, it shakes, something climbs out, and you
                give it a name. About a minute, start to finish.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold tabular-nums text-moss">2 · They move in</p>
              <h3 className="mt-2 font-display text-2xl text-ink">They live where you are.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                On this website first — wandering the pages, napping by buttons, watching your
                cursor. Pin it in a browser window and they sit in the corner of your screen. The
                desktop app comes later, and they move in with everything they own.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold tabular-nums text-moss">3 · Find out who you got</p>
              <h3 className="mt-2 font-display text-2xl text-ink">Nobody else has your exact one.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Every companion is born with a hidden personality and a few secrets. You don&apos;t
                choose who they are — you meet them. Their profile remembers every day of it.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
          <p className="kicker">What they do all day</p>
          <KineticTitle as="h2" className="mt-3 max-w-[18ch] text-4xl text-ink md:text-6xl">
            They fit into your day without asking for it.
          </KineticTitle>
          <div className="mt-10 grid gap-10 md:grid-cols-4">
            <div>
              <p className="text-sm font-medium tabular-nums text-moss">09:04</p>
              <h3 className="mt-2 font-display text-2xl text-ink">He&apos;s already up.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Open the page and there&apos;s a little hop at the edge of your screen. He noticed
                you arrived before you noticed him.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium tabular-nums text-moss">14:20</p>
              <h3 className="mt-2 font-display text-2xl text-ink">He keeps to himself.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Naps by a button, watches your cursor, climbs something he should not. If he has
                learned Focus Buddy, he settles beside you instead.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium tabular-nums text-moss">16:45</p>
              <h3 className="mt-2 font-display text-2xl text-ink">He reminds you, quietly.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Break Buddy pulls out a tiny drink and has a sip. You get the hint. No popup, no
                streak, no guilt.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium tabular-nums text-moss">23:50</p>
              <h3 className="mt-2 font-display text-2xl text-ink">He puts himself to bed.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Late enough, he yawns and curls up on his own. Nothing bad happens if you close the
                lid. Nothing ever does.
              </p>
            </div>
          </div>
          <p className="mt-10 max-w-xl text-ink-soft">
            Every useful thing is optional and taught, never default. Someone who wants none of it
            can simply let the creature exist.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-10">
          <div className="rounded-[1.8rem] bg-mist p-8 ring-1 ring-ink/10 md:p-12">
            <p className="kicker">Yours</p>
            <KineticTitle as="h2" className="mt-3 max-w-[16ch] text-4xl text-ink md:text-6xl">
              Nobody else has this one.
            </KineticTitle>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Every companion is born with hidden tendencies — curiosity, courage, energy,
              clinginess, mischief. You never see the numbers. Two people can adopt the same
              species on the same day and end up with completely different roommates. You
              don&apos;t choose the personality. You meet it.
            </p>
            <blockquote className="mt-8 max-w-xl border-l-2 border-moss pl-5 text-ink">
              <p className="font-display text-2xl leading-snug">“Apparently Kevin is a chaotic coward.”</p>
              <p className="mt-2 text-ink-soft">
                Curious about everything. Brave about almost nothing. Deeply suspicious of sudden
                cursor movement.
              </p>
            </blockquote>
            <p className="mt-8">
              <Link href="/my-companions" className="text-sm text-moss underline underline-offset-4">
                Where yours lives
              </Link>
            </p>
          </div>
        </section>

        <section id="meet" className="px-0 py-16">
          <div className="mx-auto max-w-6xl px-5 md:px-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="kicker">Meet them</p>
                <KineticTitle as="h2" className="mt-3 text-4xl text-ink md:text-6xl">
                  Four of them, for now.
                </KineticTitle>
              </div>
              <Link href="/companions" prefetch={false} className="text-sm text-moss underline underline-offset-4">
                See all
              </Link>
            </div>
            <p className="mt-4 max-w-xl text-ink-soft">
              Each species has habits. Each individual has a personality. Start with whoever
              won&apos;t leave you alone.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-6xl px-5 md:px-10">
            <DeferredMeet />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
          <p className="kicker">Their stuff</p>
          <KineticTitle as="h2" className="mt-4 max-w-[18ch] text-4xl text-ink md:text-6xl">
            You&apos;ll see something and think: he needs that.
          </KineticTitle>
          <p className="mt-4 max-w-xl text-ink-soft">
            Outfits change how they look. Gadgets become new things they do — the skateboard means
            he skates. Skills are tricks you taught them, and they know them forever.
          </p>
          <div className="mt-10">
            <DeferredTheirStuff />
          </div>
          <p className="mt-6">
            <Link href="/stuff" prefetch={false} className="text-sm text-moss underline underline-offset-4">
              Browse their stuff
            </Link>
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-10">
          <p className="kicker">Where they live</p>
          <KineticTitle as="h2" className="mt-4 max-w-[18ch] text-4xl text-ink md:text-6xl">
            Here now. On your whole computer eventually.
          </KineticTitle>
          <p className="mt-4 max-w-xl text-ink-soft">
            The website is home. A pinned browser window keeps them in the corner of your screen
            today — even on a work computer. The desktop app is the dream: the same companion
            roaming your actual desktop, with everything they own and everything they remember.
          </p>
          <p className="mt-6 flex flex-wrap gap-4">
            <Link href="/live" prefetch={false} className="text-sm text-moss underline underline-offset-4">
              See all three homes
            </Link>
            <Link href="/browser" prefetch={false} className="text-sm text-moss underline underline-offset-4">
              Keep them in your browser
            </Link>
          </p>
        </section>
      </div>

      <section className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-28 pt-12 text-center md:px-10">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-blush/20 blur-3xl" />
        <KineticTitle as="h2" className="text-5xl text-ink md:text-7xl">
          {brand.bottomCta}
        </KineticTitle>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          From {adoptFrom}. Yours forever — same name, same tricks, same history, for as long as
          you want them.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span data-creature-spot="adopt" className="inline-block">
            <Link href="/companions/bloop" prefetch={false} className="inline-block rounded-full bg-ink px-7 py-3.5 text-paper">
              Meet Bloop first
            </Link>
          </span>
        </div>
      </section>
    </div>
  );
}
