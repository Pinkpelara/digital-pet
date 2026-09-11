import Link from "next/link";
import { companions } from "@/data/catalog";
import { HeroBanner } from "@/components/stage/HeroBanner";
import { ResidentGallery } from "@/components/stage/ResidentGallery";
import {
  LetLoose,
  LiveYourDay,
  MakeYoursDemo,
  SomethingHappened,
  TheyNotice,
  ThingsChange,
  TinyProblem,
  TwinBloops,
} from "@/components/home/HomeSections";

const steps = [
  {
    title: "Adopt",
    body: "Meet one individual — not a copy of someone else’s. Soft trial before a paywall.",
  },
  {
    title: "Discover",
    body: "Its quirks show up on their own. Two of the same species never match.",
  },
  {
    title: "Make it yours",
    body: "Name it, dress it, hand it gadgets, teach it tricks.",
  },
  {
    title: "Let it loose",
    body: "Live with it here now. Desktop roaming comes later.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-paper">
      <HeroBanner />

      <section id="how-they-live" className="mx-auto max-w-6xl px-5 py-16 md:px-10">
        <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="text-sm font-medium text-moss">0{index + 1}</span>
              <p className="mt-3 font-display text-2xl text-ink">{step.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-0 py-8">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-moss">Meet them</p>
              <h2 className="mt-2 font-display text-4xl text-ink md:text-5xl">Four species. Live.</h2>
            </div>
            <Link href="/companions" className="text-sm text-moss underline underline-offset-4">
              See all
            </Link>
          </div>
        </div>
        <div className="mt-6 h-[min(58vh,520px)] w-full overflow-hidden bg-cream">
          <ResidentGallery className="h-full w-full" />
        </div>
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-4 md:px-10">
          {companions.map((companion) => (
            <Link key={companion.id} href={`/companions/${companion.slug}`} className="group">
              <h3 className="font-display text-2xl text-ink group-hover:text-moss">{companion.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{companion.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <TwinBloops />
      <LiveYourDay />
      <MakeYoursDemo />
      <ThingsChange />
      <TheyNotice />
      <SomethingHappened />
      <TinyProblem />
      <LetLoose />

      <section className="mx-auto max-w-6xl px-5 pb-24 pt-8 text-center md:px-10">
        <h2 className="font-display text-4xl text-ink md:text-6xl">Meet one individual</h2>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          Pick a species. Give it a name. Find out who showed up. Personality is not for sale.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/companions/bloop" className="inline-block rounded-full bg-ink px-7 py-3.5 text-paper">
            Meet Bloop
          </Link>
          <Link href="/companions" className="inline-block rounded-full border border-ink/15 px-7 py-3.5 text-ink">
            Adopt one individual
          </Link>
        </div>
      </section>
    </div>
  );
}
