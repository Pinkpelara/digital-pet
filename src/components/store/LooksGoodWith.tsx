import Link from "next/link";
import { items } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { hrefForItem } from "@/lib/catalog-paths";

export function LooksGoodWith({ ids }: { ids: string[] }) {
  const related = ids
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Looks good with</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {related.map((item) => (
          <Link
            key={item.id}
            href={hrefForItem(item)}
            className="rounded-2xl border border-ink/8 bg-paper px-4 py-3 hover:border-ink/20"
          >
            <p className="font-medium text-ink">{item.name}</p>
            <p className="text-sm text-ink-soft">{formatPrice(item.priceCents)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
