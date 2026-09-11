import Link from "next/link";
import { companions, items, adoptFromCents } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { brand } from "@/lib/brand";
import { PageHero } from "@/components/site/KineticTitle";
import { PersonalityCards } from "@/components/home/PersonalityCards";

export const metadata = { title: "Companions" };

export default function CompanionsPage() {
  return (
    <div className="bg-paper pb-20">
      <PageHero
        kicker={`Adopt from ${formatPrice(adoptFromCents())}. Start with Bloop.`}
        title="Adopt one"
        lede={
          <>
            <p>{brand.meetBody}</p>
            <p className="mt-2">{brand.heroSupport}</p>
            <p className="mt-3 font-display text-2xl text-ink">{brand.closer}</p>
          </>
        }
      >
        <p className="mt-6 text-sm text-ink-soft">
          {companions.length} species. No two alike — even within a species.
        </p>
      </PageHero>

      <div className="mx-auto max-w-6xl px-5 pb-8 md:px-10">
        <PersonalityCards />
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {companions.map((companion) => {
            const product = items.find((item) => item.id === companion.itemId);
            return (
              <li key={`${companion.id}-price`} className="flex items-baseline justify-between gap-4 border-t border-ink/10 pt-4">
                <div>
                  <p className="text-[11px] tracking-[0.24em] text-moss">{companion.alias}</p>
                  <Link href={`/companions/${companion.slug}`} className="font-display text-2xl text-ink hover:text-moss">
                    {companion.name}
                  </Link>
                </div>
                <p className="text-sm text-ink">
                  {product ? formatPrice(product.priceCents) : ""} · Adopt
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
