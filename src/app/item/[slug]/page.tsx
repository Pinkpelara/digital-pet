import { Suspense } from "react";
import { notFound } from "next/navigation";
import { items } from "@/data/catalog";
import { TryOnStage } from "@/components/store/TryOnStage";

export function generateStaticParams() {
  return items.filter((item) => item.kind !== "companion").map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = items.find((entry) => entry.slug === slug);
  return { title: item?.name ?? "Item" };
}

export default async function ItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = items.find((entry) => entry.slug === slug && entry.kind !== "companion");
  if (!product) notFound();
  const species =
    product.speciesId ??
    (product.looksGoodWith.includes("companion-mochi")
      ? "mochi"
      : product.looksGoodWith.includes("companion-niblet")
        ? "niblet"
        : product.looksGoodWith.includes("companion-sprout")
          ? "sprout"
          : "bloop");
  const suggestions = items.filter((item) => product.looksGoodWith.includes(item.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="mb-6 text-xs uppercase tracking-[0.2em] text-moss">{product.kind}</p>
      <Suspense>
        <TryOnStage species={species} product={product} suggestions={suggestions} />
      </Suspense>
      {product.unlocksBehavior && (
        <p className="mt-8 rounded-2xl bg-cream px-4 py-3 text-sm text-ink">
          Gadget behaviour unlocked: {product.unlocksBehavior}
        </p>
      )}
      {product.limitedNote && <p className="mt-4 text-sm text-ink-soft">{product.limitedNote}</p>}
    </div>
  );
}
