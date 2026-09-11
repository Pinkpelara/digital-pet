import { Suspense } from "react";
import { notFound } from "next/navigation";
import { items } from "@/data/catalog";
import { TryOnStage } from "@/components/store/TryOnStage";
import { ProductJsonLd } from "@/components/store/ProductJsonLd";

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
    <div className="bg-paper">
      <ProductJsonLd item={product} />
      <Suspense>
        <TryOnStage species={species} product={product} suggestions={suggestions} />
      </Suspense>
      {product.unlocksBehavior && (
        <p className="mx-auto max-w-6xl px-5 pb-10 text-sm text-ink-soft md:px-10">
          This changes what they do: {product.behaviorNote ?? product.unlocksBehavior}
        </p>
      )}
      {product.limitedNote && (
        <p className="mx-auto max-w-6xl px-5 pb-12 text-sm text-ink-soft md:px-10">{product.limitedNote}</p>
      )}
    </div>
  );
}
