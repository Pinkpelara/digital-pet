import Link from "next/link";
import { companions, items } from "@/data/catalog";
import { LiveStage } from "@/components/stage/LiveStage";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Companions" };

export default function CompanionsPage() {
  return (
    <div className="bg-paper">
      <section className="mx-auto max-w-6xl px-5 pt-12 md:px-10 md:pt-16">
        <p className="text-sm font-medium text-moss">Adopt</p>
        <h1 className="mt-3 max-w-[14ch] font-display text-5xl leading-[0.98] text-ink md:text-7xl">
          Meet the companions.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-soft">
          Pick a species and you get an individual. Its personality is already decided — you just
          have not met it yet.
        </p>
      </section>

      <ol className="mx-auto grid max-w-6xl gap-6 px-5 py-12 md:grid-cols-2 md:px-10">
        {companions.map((companion) => {
          const product = items.find((item) => item.id === companion.itemId);
          return (
            <li key={companion.id} className="overflow-hidden rounded-[1.8rem] bg-cream ring-1 ring-ink/8">
              <Link href={`/companions/${companion.slug}`} className="block">
                <div className="aspect-[4/5]">
                  <LiveStage species={companion.id} className="h-full w-full" cameraZ={5.6} />
                </div>
                <div className="bg-paper px-6 py-5">
                  <h2 className="font-display text-3xl text-ink">{companion.name}</h2>
                  <p className="mt-2 text-ink-soft">{companion.title}</p>
                  <p className="mt-4 text-sm text-ink">
                    {product ? formatPrice(product.priceCents) : ""} · Meet them
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
