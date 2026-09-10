import Link from "next/link";
import { companions, items } from "@/data/catalog";
import { ResidentGallery } from "@/components/stage/ResidentGallery";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Companions" };

export default function CompanionsPage() {
  return (
    <div className="bg-void text-mist">
      <section className="mx-auto max-w-7xl px-5 pt-28 md:px-10 md:pt-32">
        <p className="text-[11px] uppercase tracking-[0.32em] text-mist/45">Adopt</p>
        <h1 className="mt-4 max-w-[12ch] font-display text-5xl leading-[0.92] text-paper md:text-7xl">
          Meet the companions.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-mist/70">
          Pick a species and you get an individual. Its personality is already decided — you just
          have not met it yet.
        </p>
      </section>
      <div className="mt-8 h-[min(70vh,620px)] w-full">
        <ResidentGallery className="h-full w-full" />
      </div>
      <ol className="mx-auto grid max-w-7xl gap-px border-t border-white/5 px-0 md:grid-cols-4">
        {companions.map((companion) => {
          const product = items.find((item) => item.id === companion.itemId);
          return (
            <li key={companion.id} className="border-white/5 p-6 md:border-l">
              <Link href={`/companions/${companion.slug}`} className="block">
                <p className="text-[11px] uppercase tracking-[0.22em] text-mist/40">{companion.id}</p>
                <h2 className="mt-2 font-display text-3xl text-paper">{companion.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-mist/60">{companion.tagline}</p>
                <p className="mt-4 text-sm text-mist/80">
                  {product ? formatPrice(product.priceCents) : ""} · Meet them
                </p>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
