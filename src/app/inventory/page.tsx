"use client";

import Link from "next/link";
import { items } from "@/data/catalog";
import { hrefForItem, studioHref } from "@/lib/catalog-paths";
import { formatPrice } from "@/lib/format";
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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="kicker">Inventory</p>
      <h1 className="mt-3 font-display text-5xl leading-[0.92] text-ink md:text-7xl">What you own</h1>
      <p className="mt-3 text-ink-soft">
        On this static preview, entitlements live in your browser (localStorage). A later Vercel deploy can grant them
        from Stripe + Supabase instead — the inventory looks the same. Permanent. Not a file.
      </p>
      {instances.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-2xl text-ink">Who lives here</h2>
          <ul className="mt-3 space-y-2">
            {instances.map((instance) => (
              <li key={instance.id}>
                <Link href={studioHref(instance.id)} className="text-ink underline">
                  {instance.name}
                </Link>
                <span className="text-ink-soft"> · a {instance.speciesId}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {rows.length === 0 ? (
        <p className="mt-8 text-ink-soft">Nothing here yet. Adopt, dress, or redeem a gift.</p>
      ) : (
        <ul className="mt-8 divide-y divide-ink/10 rounded-[1.6rem] bg-mist ring-1 ring-ink/10">
          {rows.map(({ row, item }) => (
            <li key={row.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <Link href={hrefForItem(item)} className="font-medium text-ink hover:underline">
                  {item.name}
                </Link>
                <p className="text-sm capitalize text-ink-soft">
                  {item.kind} · {row.source}
                </p>
              </div>
              <p className="text-sm text-ink-soft">{formatPrice(item.priceCents)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
