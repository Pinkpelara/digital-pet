"use client";

import Link from "next/link";
import { items } from "@/data/catalog";
import { hrefForItem } from "@/lib/catalog-paths";
import { formatPrice } from "@/lib/format";
import { useNest } from "@/lib/state/nest-context";

export default function InventoryPage() {
  const { ownership, hydrated } = useNest();
  if (!hydrated) return <div className="px-4 py-16 text-ink-soft">Counting belongings…</div>;

  const rows = ownership
    .map((row) => ({ row, item: items.find((item) => item.id === row.itemId) }))
    .filter((entry): entry is { row: (typeof ownership)[number]; item: (typeof items)[number] } => Boolean(entry.item));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">Inventory</p>
      <h1 className="mt-2 font-display text-5xl text-ink">What you own</h1>
      <p className="mt-3 text-ink-soft">
        Entitlements, not files. Ownership is granted server-side after a verified purchase — the browser never inserts it.
      </p>
      {rows.length === 0 ? (
        <p className="mt-8 text-ink-soft">Nothing here yet. Adopt, dress, or redeem a gift.</p>
      ) : (
        <ul className="mt-8 divide-y divide-ink/8 rounded-[1.6rem] bg-paper ring-1 ring-ink/8">
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
