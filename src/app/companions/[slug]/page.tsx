import { Suspense } from "react";
import { notFound } from "next/navigation";
import { companionBySlug, items } from "@/data/catalog";
import { TryOnStage } from "@/components/store/TryOnStage";

export function generateStaticParams() {
  return ["bloop", "mochi", "sprout", "niblet"].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const companion = companionBySlug.get(slug);
  return { title: companion?.name ?? "Companion" };
}

export default async function CompanionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const companion = companionBySlug.get(slug);
  const product = items.find((item) => item.slug === slug && item.kind === "companion");
  if (!companion || !product) notFound();

  const suggestions = items.filter(
    (item) => product.looksGoodWith.includes(item.id) || item.kind === "outfit" || item.kind === "skill",
  );

  return (
    <div className="bg-void">
      <Suspense>
        <TryOnStage species={companion.id} product={product} suggestions={suggestions.slice(0, 8)} />
      </Suspense>
      <ul className="mx-auto flex max-w-7xl flex-wrap gap-2 px-5 pb-16 md:px-10">
        {companion.traits.map((trait) => (
          <li key={trait} className="rounded-full border border-white/10 px-3 py-1 text-sm text-mist/70">
            {trait}
          </li>
        ))}
      </ul>
    </div>
  );
}
