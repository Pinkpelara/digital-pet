import Link from "next/link";
import { companions, items } from "@/data/catalog";
import { ProductCard } from "@/components/store/ProductCard";
import { HeroBanner } from "@/components/stage/HeroBanner";
import { ResidentGallery } from "@/components/stage/ResidentGallery";
import { TwinBloops } from "@/components/home/HomeSections";
import { hrefForItem } from "@/lib/catalog-paths";
import { brand } from "@/lib/brand";

const steps = [
  {
    title: "Adopt",
    body: "Choose a species. You get an individual companion, not a copy of someone else's.",
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
    body: "Live with it here now. Desktop roaming is the flagship experience, later.",
  },
];

export default function HomePage() {
  const featured = items.filter((item) =>
    ["companion-bloop", "outfit-raincoat", "skill-moonwalk", "gadget-skateboard"].includes(item.id),
  );

  return (
    <div className="bg-paper">
      <HeroBanner />

      <section className="relative bg-void py-8 text-mist md:py-10">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-mist/45">Meet them</p>
              <h2 className="mt-3 font-display text-4xl text-paper md:text-6xl">
                Four species. Each one an individual.
              </h2>
            </div>
            <Link href="/companions" className="text-sm text-mist/60 underline decoration-mist/25 underline-offset-4">
              See all
            </Link>
          </div>
        </div>
        <div className="mt-6 h-[min(72vh,640px)] w-full">
          <ResidentGallery className="h-full w-full" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-4 md:px-10">
          {companions.map((companion) => (
            <Link key={companion.id} href={`/companions/${companion.slug}`} className="group">
              <p className="text-[11px] uppercase tracking-[0.22em] text-mist/40">{companion.id}</p>
              <h3 className="mt-2 font-display text-3xl text-paper group-hover:text-mist">{companion.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist/60">{companion.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <TwinBloops />

      <section className="mx-auto max-w-6xl px-4 py-24">
        <ol className="grid gap-px overflow-hidden border border-ink/10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="bg-paper p-8 md:p-10">
              <span className="text-[11px] uppercase tracking-[0.28em] text-moss">0{index + 1}</span>
              <p className="mt-4 font-display text-3xl text-ink md:text-4xl">{step.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <p className="text-[11px] uppercase tracking-[0.32em] text-moss">Give them something unnecessary</p>
        <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">Things that change what they do.</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          A skateboard means skating. A hammock means naps. Gadgets and skills are not decoration —
          they are new behaviour. Personality, though, is not for sale.
        </p>
        <div className="mt-6">
          {featured.map((item) => (
            <ProductCard key={item.id} item={item} href={hrefForItem(item)} />
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/companions" className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
            {brand.concept[0]} someone
          </Link>
          <Link href="/desktop" className="text-sm text-ink-soft underline underline-offset-4">
            Desktop roaming: what exists today
          </Link>
        </div>
      </section>
    </div>
  );
}
