import Link from "next/link";
import { companions, items } from "@/data/catalog";
import { LiveStage } from "@/components/stage/LiveStage";
import { ProductCard } from "@/components/store/ProductCard";
import { HeroBanner } from "@/components/stage/HeroBanner";
import { hrefForItem } from "@/lib/catalog-paths";
import { brand } from "@/lib/brand";

export default function HomePage() {
  const featured = items.filter((item) =>
    ["companion-bloop", "outfit-raincoat", "skill-moonwalk", "drop-cape"].includes(item.id),
  );

  return (
    <div>
      <HeroBanner />

      <section className="mx-auto max-w-6xl px-4 py-20">
        <ol className="grid gap-px overflow-hidden rounded-2xl bg-ink/10 md:grid-cols-3">
          {brand.concept.map((step, index) => (
            <li key={step} className="bg-paper p-8">
              <span className="text-[11px] uppercase tracking-[0.28em] text-moss">0{index + 1}</span>
              <p className="mt-4 font-display text-3xl text-ink">{step}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {index === 0 && "An entitlement, not a file. It lives in the nest — like a backpack that grew a pulse."}
                {index === 1 && "Try a coat. Teach a moonwalk. Save the look to one companion."}
                {index === 2 && "Website first. Browser pin for work machines. Desktop only if you want it."}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-stage py-20 text-mist">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-moss">Residents</p>
              <h2 className="mt-3 font-display text-4xl text-paper md:text-5xl">Four volumes. One sill.</h2>
            </div>
            <Link href="/companions" className="text-sm text-mist/70 underline decoration-mist/30 underline-offset-4">
              See all
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {companions.map((companion) => (
              <Link key={companion.id} href={`/companions/${companion.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-void">
                  <LiveStage species={companion.id} className="h-full w-full" followPointer cameraZ={3.8} />
                </div>
                <h3 className="mt-4 font-display text-2xl text-paper">{companion.name}</h3>
                <p className="mt-1 text-sm text-mist/70">{companion.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-[11px] uppercase tracking-[0.32em] text-moss">On the sill</p>
        <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">Belongings, not merch.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((item) => (
            <ProductCard key={item.id} item={item} href={hrefForItem(item)} />
          ))}
        </div>
      </section>
    </div>
  );
}
