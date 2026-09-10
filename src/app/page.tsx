import Link from "next/link";
import { companions, items } from "@/data/catalog";
import { Creature } from "@/components/creatures/Creature";
import { ProductCard } from "@/components/store/ProductCard";
import { WorldLayer } from "@/components/creatures/WorldLayer";
import { hrefForItem } from "@/lib/catalog-paths";
import { brand } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ pause?: string }>;
}) {
  const query = await searchParams;
  const featured = items.filter((item) => ["companion-bloop", "outfit-raincoat", "skill-moonwalk", "drop-cape"].includes(item.id));
  const paused = query.pause === "1";

  return (
    <div>
      {!paused && <WorldLayer enabled />}
      <section className="relative mx-auto max-w-6xl overflow-hidden px-4 pb-10 pt-16">
        <div className="pointer-events-none absolute right-[8%] top-10 hidden md:block">
          <div className="headline-peek">
            <Creature species="mochi" size={150} mood="nap" equipped={{ body: "outfit-hoodie" }} decorative />
          </div>
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-moss">A world, not a storefront</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] text-ink md:text-7xl">
          Tiny creatures for your screen.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-soft md:text-xl">
          Adopt one. Dress it. Teach it tricks. Then let it loose on your computer.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/companions" className="rounded-full bg-ink px-5 py-3 text-paper">
            Meet the companions
          </Link>
          <Link href="/desktop" className="rounded-full border border-ink/15 px-5 py-3 text-ink">
            Bring one to desktop
          </Link>
        </div>
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {brand.concept.map((step, index) => (
            <li key={step} className="relative rounded-[1.4rem] bg-paper/80 p-5 ring-1 ring-ink/8">
              <span className="font-display text-4xl text-moss/40">{index + 1}</span>
              <p className="mt-2 font-display text-2xl text-ink">{step}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {index === 0 && "Buy an entitlement. It lives in your nest — Roblox-like inventory, never a file download."}
                {index === 1 && "Try a raincoat. Teach a moonwalk. Save the outfit to one companion."}
                {index === 2 && "Open the desktop app (soon) or a companions:// link. They already know you."}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-10 sill" aria-hidden="true" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-moss">Residents</p>
            <h2 className="mt-2 font-display text-4xl text-ink">Four temperaments. One sill.</h2>
          </div>
          <Link href="/companions" className="text-sm text-ink-soft underline">
            See all
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {companions.map((companion) => (
            <Link
              key={companion.id}
              href={`/companions/${companion.slug}`}
              className="card-lift rounded-[1.6rem] bg-paper p-5 ring-1 ring-ink/8"
            >
              <Creature species={companion.id} size={150} decorative />
              <h3 className="mt-2 font-display text-2xl">{companion.name}</h3>
              <p className="text-sm text-ink-soft">{companion.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-moss">On the sill today</p>
        <h2 className="mt-2 font-display text-4xl text-ink">Not merchandise. Belongings.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((item) => (
            <ProductCard key={item.id} item={item} href={hrefForItem(item)} />
          ))}
        </div>
      </section>
    </div>
  );
}
