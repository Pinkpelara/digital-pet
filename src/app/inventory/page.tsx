"use client";

import Link from "next/link";
import { items } from "@/data/catalog";
import { hrefForItem, profileHref, studioHref } from "@/lib/catalog-paths";
import { formatPrice } from "@/lib/format";
import { useNest } from "@/lib/state/nest-context";

export default function InventoryPage() {
  const { ownership, instances, hydrated } = useNest();
  const rows = ownership
    .map((row) => ({ row, item: items.find((item) => item.id === row.itemId) }))
    .filter((entry): entry is { row: (typeof ownership)[number]; item: (typeof items)[number] } =>
      Boolean(entry.item),
    );

  if (!hydrated) {
    return <div className="mx-auto max-w-4xl px-5 py-16 text-ink-soft">Opening the backpack.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 md:px-10">
      <p className="kicker">Inventory</p>
      <h1 className="mt-2 font-display text-5xl text-ink">What you own</h1>
      <p className="mt-3 text-ink-soft">
        Permanent entitlements in your account. On this demo they are stored in your browser; with
        Supabase and Stripe connected, the same inventory is granted server-side after checkout.
      </p>

      {instances.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-2xl text-ink">Who lives here</h2>
          <ul className="mt-3 space-y-2">
            {instances.map((instance) => (
              <li key={instance.id} className="flex flex-wrap items-center gap-3">
                <Link href={profileHref(instance.id)} className="font-semibold text-ink underline">
                  {instance.name}
                </Link>
                <span className="text-ink-soft">a {instance.speciesId}</span>
                <Link href={studioHref(instance.id)} className="text-sm text-moss underline">
                  customize
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {rows.length === 0 ? (
        <p className="mt-8 text-ink-soft">Nothing here yet. Adopt someone, or open a gift.</p>
      ) : (
        <ul className="mt-8 divide-y divide-ink/10 overflow-hidden rounded-[28px] border border-ink/10 bg-card">
          {rows.map(({ row, item }) => (
            <li key={row.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <Link href={hrefForItem(item)} className="font-semibold text-ink hover:underline">
                  {item.kind === "skill" ? `Teach ${item.name}` : item.name}
                </Link>
                <p className="text-sm text-ink-soft">
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
