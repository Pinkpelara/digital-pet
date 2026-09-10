import Link from "next/link";
import { companions, items } from "@/data/catalog";
import { ProductCard } from "@/components/store/ProductCard";
import { HeroBanner } from "@/components/stage/HeroBanner";
import { ResidentGallery } from "@/components/stage/ResidentGallery";
import { hrefForItem } from "@/lib/catalog-paths";
import { brand } from "@/lib/brand";

export default function HomePage() {
  const featured = items.filter((item) =>
    ["companion-bloop", "outfit-raincoat", "skill-moonwalk", "drop-cape"].includes(item.id),
  );

  return (
    <div className="bg-paper">
      <HeroBanner />

      <section className="relative bg-void py-8 text-mist md:py-10">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-mist/45">Residents</p>
              <h2 className="mt-3 font-display text-4xl text-paper md:text-6xl">Four volumes. One sill.</h2>
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

      <section className="mx-auto max-w-6xl px-4 py-24">
        <ol className="grid gap-px overflow-hidden border border-ink/10 md:grid-cols-3">
          {brand.concept.map((step, index) => (
            <li key={step} className="bg-paper p-8 md:p-10">
              <span className="text-[11px] uppercase tracking-[0.28em] text-moss">0{index + 1}</span>
              <p className="mt-4 font-display text-3xl text-ink md:text-4xl">{step}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {index === 0 && "An entitlement, not a file. It lives in the nest — like a backpack that grew a pulse."}
                {index === 1 && "Try a coat. Teach a moonwalk. Save the look to one companion."}
                {index === 2 && "Website first. Browser pin for work machines. Desktop only if you want it."}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <p className="text-[11px] uppercase tracking-[0.32em] text-moss">On the sill</p>
        <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">Belongings, not merch.</h2>
        <div className="mt-4">
          {featured.map((item) => (
            <ProductCard key={item.id} item={item} href={hrefForItem(item)} />
          ))}
        </div>
      </section>
    </div>
  );
}
