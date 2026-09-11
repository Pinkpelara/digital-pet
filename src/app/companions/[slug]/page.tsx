import { Suspense } from "react";
import { notFound } from "next/navigation";
import { companionBySlug, items } from "@/data/catalog";
import { ProductJsonLd } from "@/components/store/ProductJsonLd";
import { TryOnStage } from "@/components/store/TryOnStage";

export function generateStaticParams() {
  return ["bloop", "mochi", "sprout", "niblet"].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const companion = companionBySlug.get(slug);
  return {
    title: companion ? `${companion.name} — adopt a ${companion.name}` : "Companion",
    description: companion?.tagline,
  };
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
    <div className="bg-paper">
      <ProductJsonLd item={product} />
      <Suspense>
        <TryOnStage
          species={companion.id}
          product={product}
          suggestions={suggestions.slice(0, 8)}
          oneLiner={companion.title}
        />
      </Suspense>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-10">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-moss">{companion.alias}</p>
        <div className="mt-6 grid gap-8 border-t border-ink/10 pt-12 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-ink-soft">Known habits</p>
            <ul className="mt-3 space-y-1 text-ink">
              {companion.knownHabits.map((habit) => (
                <li key={habit}>· {habit}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-ink-soft">Native talent</p>
            <p className="mt-3 text-ink">{companion.nativeTalent}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-ink-soft">Secrets</p>
            <ul className="mt-3 space-y-1 text-ink-soft">
              <li>??? still undiscovered</li>
              <li>??? still undiscovered</li>
              <li>??? still undiscovered</li>
            </ul>
            <p className="mt-3 text-sm text-ink-soft">They keep a few things to themselves.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
