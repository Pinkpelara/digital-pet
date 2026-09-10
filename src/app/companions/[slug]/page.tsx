import { notFound } from "next/navigation";
import { companionBySlug, items } from "@/data/catalog";
import { TryOnStage } from "@/components/store/TryOnStage";

export async function generateStaticParams() {
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

  const suggestions = items.filter((item) => product.looksGoodWith.includes(item.id) || item.kind === "outfit" || item.kind === "skill");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <TryOnStage species={companion.id} product={product} suggestions={suggestions.slice(0, 8)} />
      <ul className="mt-10 flex flex-wrap gap-2">
        {companion.traits.map((trait) => (
          <li key={trait} className="rounded-full bg-cream px-3 py-1 text-sm text-ink">
            {trait}
          </li>
        ))}
      </ul>
    </div>
  );
}
