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
              <h3 className="mt-2 font-display text-2xl text-ink">Choose a pet. Name them.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Digital pets start at $5.99. A parcel opens on your screen, your new pet climbs out,
                and you give them a name. About a minute, start to finish.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold tabular-nums text-moss">2 · They move in</p>
              <h3 className="mt-2 font-display text-2xl text-ink">They live on your computer.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Your pet stays with you on this site — walking the pages, sleeping, watching your
                cursor. Add the site to your browser in one click and they sit in the corner of your
                screen while you work. A desktop app is in development. When it ships, your pet
                moves over with everything they own.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold tabular-nums text-moss">3 · They become themselves</p>
              <h3 className="mt-2 font-display text-2xl text-ink">Every pet develops its own personality.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Each pet starts with hidden traits. Some are bold, some are shy, some sleep all day.
                You learn who you have by spending time together, and their profile keeps the
                history.
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
              <h3 className="mt-2 font-display text-2xl text-ink">They notice when you arrive.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Open the site and your pet is already up. If you taught them Greeter, they hop over
                to say hello.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium tabular-nums text-moss">14:20</p>
              <h3 className="mt-2 font-display text-2xl text-ink">They stay nearby while you work.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Napping beside a button, watching your cursor, occasionally climbing something they
                should not. With Focus Buddy taught, they settle down beside you instead.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium tabular-nums text-moss">16:45</p>
              <h3 className="mt-2 font-display text-2xl text-ink">They remind you without saying anything.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                With Break Buddy taught, your pet pulls out a small drink and takes a sip when it is
                time for a pause. You catch the hint. There is no popup and no streak.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium tabular-nums text-moss">23:50</p>
              <h3 className="mt-2 font-display text-2xl text-ink">They put themselves to bed.</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                With Bedtime taught, they yawn and curl up on their own at night. Close the lid
                whenever you like. Nothing bad happens while you are away.
              </p>
            </div>
          </div>
          <p className="mt-10 max-w-xl text-ink-soft">
            Every one of these is optional. Teach them or skip them. Company comes first.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-10">
          <div className="rounded-[1.8rem] bg-mist p-8 ring-1 ring-ink/10 md:p-12">
            <p className="kicker">One of a kind</p>
            <KineticTitle as="h2" className="mt-3 max-w-[16ch] text-4xl text-ink md:text-6xl">
              Your pet is their own character.
            </KineticTitle>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Digital pets are characters with habits of their own, the way a real pet has a
              personality. Every one starts with hidden traits — curiosity, courage, energy,
              clinginess — and develops from there. Two people can adopt the same kind on the same
              day and raise two completely different pets. You never see numbers or settings. You
              learn who they are by living with them.
            </p>
            <p className="mt-6 text-sm text-ink-soft">After a few weeks, a profile might read:</p>
            <blockquote className="mt-4 max-w-xl border-l-2 border-moss pl-5 text-ink">
              <p className="font-display text-2xl leading-snug">“Apparently Kevin is a chaotic coward.”</p>
              <p className="mt-2 text-ink-soft">
                Curious about everything. Brave about almost nothing. Deeply suspicious of sudden
                cursor movement.
              </p>
            </blockquote>
            <p className="mt-8 flex flex-wrap gap-4">
              <Link href="/my-companions" className="text-sm text-moss underline underline-offset-4">
                Where your pet lives
              </Link>
              <Link href="/stuff" className="text-sm text-moss underline underline-offset-4">
                What you can give them
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
              Each kind of pet has habits of its own. Each one has a personality of its own. Start
              with whoever won&apos;t leave you alone.
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
