"use client";

import Link from "next/link";
import { items } from "@/data/catalog";
import { hrefForItem, isShopSafe, studioHref } from "@/lib/catalog-paths";
import { formatPrice } from "@/lib/format";
import { PageHero } from "@/components/site/KineticTitle";
import { useNest } from "@/lib/state/nest-context";

export default function InventoryPage() {
  const { ownership, instances, hydrated } = useNest();
  const rows = ownership
    .map((row) => ({ row, item: items.find((item) => item.id === row.itemId) }))
    .filter((entry): entry is { row: (typeof ownership)[number]; item: (typeof items)[number] } => Boolean(entry.item));

  if (!hydrated) {
    return <div className="mx-auto max-w-4xl px-4 py-12 text-ink-soft">Opening the backpack…</div>;
  }

  return (
    <div className="bg-paper pb-20">
      <PageHero
        kicker="Inventory"
        title="What you own"
        lede="Permanent. Not a file. On this static preview, entitlements live in your browser. A later deploy can grant them from Stripe + Supabase — the backpack looks the same."
      />
      <div className="mx-auto max-w-4xl px-5 md:px-10">
        {instances.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-3xl text-ink">Who lives here</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {instances.map((instance) => (
                <li key={instance.id}>
                  <Link
                    href={studioHref(instance.id)}
                    className="flex items-baseline justify-between rounded-[1.3rem] bg-mist px-5 py-4 ring-1 ring-ink/10 hover:ring-moss/40"
                  >
                    <span className="font-display text-2xl text-ink">{instance.name}</span>
                    <span className="text-sm text-ink-soft">a {instance.speciesId}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        {rows.length === 0 ? (
          <p className="text-ink-soft">Nothing here yet. Adopt, dress, or redeem a gift.</p>
        ) : (
          <ul className="divide-y divide-ink/10 overflow-hidden rounded-[1.6rem] bg-mist ring-1 ring-ink/10">
            {rows.map(({ row, item }) => (
              <li key={row.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <Link href={hrefForItem(item)} className="font-medium text-ink hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-sm capitalize text-ink-soft">
                    {item.kind} · {row.source}
                    {isShopSafe(item) ? "" : " · preview"}
                  </p>
                </div>
                <p className="text-sm tabular-nums text-ink">{formatPrice(item.priceCents)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
