import { notFound } from "next/navigation";
import { companionBySlug, items } from "@/data/catalog";
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
    <div className="bg-void text-mist">
      <TryOnStage species={companion.id} product={product} suggestions={suggestions.slice(0, 8)} />

      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-10">
        <div className="grid gap-8 border-t border-white/10 pt-12 md:grid-cols-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-mist/45">Known habits</p>
            <ul className="mt-3 space-y-1 text-mist/85">
              {companion.knownHabits.map((habit) => (
                <li key={habit}>· {habit}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-mist/45">Native talent</p>
            <p className="mt-3 text-mist/85">{companion.nativeTalent}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-mist/45">Secrets</p>
            <ul className="mt-3 space-y-1 text-mist/60">
              <li>??? still undiscovered</li>
              <li>??? still undiscovered</li>
              <li>??? still undiscovered</li>
            </ul>
            <p className="mt-3 text-sm text-mist/50">
              {companion.secrets.length} hidden behaviours exist. You find them by living together,
              not by paying.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
