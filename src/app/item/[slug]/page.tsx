import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { items } from "@/data/catalog";
import { TryOnStage } from "@/components/store/TryOnStage";
import { LooksGoodWith } from "@/components/store/LooksGoodWith";
import { ProductJsonLd } from "@/components/store/ProductJsonLd";

export function generateStaticParams() {
  return items.filter((item) => item.kind !== "companion").map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = items.find((entry) => entry.slug === slug);
  return { title: item?.name ?? "Item", description: item?.tagline };
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
    <div className="bg-paper pb-20">
      <ProductJsonLd item={product} />
      <Suspense>
        <TryOnStage species={species} product={product} suggestions={suggestions} />
      </Suspense>

      <div className="mx-auto max-w-6xl px-5 md:px-10">
        {product.kind === "skill" && (
          <div className="rounded-[1.8rem] bg-mist p-8 ring-1 ring-ink/10">
            <h2 className="font-display text-3xl text-ink">Teach it once. They know it forever.</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
              Skills are not animations you press a button to play. Your companion learns this and
              does it on their own, whenever they feel like it. Their profile remembers it for as
              long as you have them.
            </p>
            <p className="mt-5">
              <Link href="/my-companions/studio" className="text-sm text-moss underline underline-offset-4">
                Teach it to your companion
              </Link>
            </p>
          </div>
        )}
        {product.kind === "gadget" && (
          <div className="rounded-[1.8rem] bg-mist p-8 ring-1 ring-ink/10">
            <h2 className="font-display text-3xl text-ink">A gadget is a new possibility.</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
              Own it and it becomes part of their day — they pick it up on their own, use it, put it
              down, sometimes show off with it. Take it off and they go back to being themselves.
            </p>
            <p className="mt-5">
              <Link href="/my-companions/studio" className="text-sm text-moss underline underline-offset-4">
                Put it on your companion
              </Link>
            </p>
          </div>
        )}
        {product.limitedNote && (
          <p className="mt-8 max-w-xl text-sm text-ink-soft">{product.limitedNote}</p>
        )}
        <LooksGoodWith ids={product.looksGoodWith} />
      </div>
    </div>
  );
}
