import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { companionBySlug, items } from "@/data/catalog";
import { ProductJsonLd } from "@/components/store/ProductJsonLd";
import { TryOnStage } from "@/components/store/TryOnStage";
import { ProductCard } from "@/components/store/ProductCard";
import { ShowreelCanvas } from "@/components/store/ShowreelCanvas";
import { hrefForItem } from "@/lib/catalog-paths";
import { KineticTitle } from "@/components/site/KineticTitle";

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
    <ShowreelCanvas>
      <div className="bg-paper">
        <ProductJsonLd item={product} />
        <Suspense>
          <TryOnStage
            species={companion.id}
            product={product}
            suggestions={suggestions.slice(0, 8)}
            oneLiner={companion.title}
            kicker={companion.alias}
          />
        </Suspense>

        <section className="mx-auto max-w-6xl px-5 pb-16 md:px-10">
          <p className="kicker">Living with {companion.name}</p>
          <KineticTitle as="h2" className="mt-3 max-w-[20ch] text-3xl text-ink md:text-5xl">
            {companion.description}
          </KineticTitle>
          <div className="mt-10 grid gap-8 border-t border-ink/10 pt-10 md:grid-cols-3">
            {companion.knownHabits.map((habit) => (
              <p key={habit} className="text-lg leading-relaxed text-ink">
                {habit}
              </p>
            ))}
          </div>
          <p className="mt-8 max-w-xl text-ink-soft">
            <span className="font-medium text-ink">Born good at: </span>
            {companion.nativeTalent}
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16 md:px-10">
          <div className="rounded-[1.8rem] bg-mist p-8 ring-1 ring-ink/10 md:p-10">
            <p className="kicker">Yours will be different</p>
            <h2 className="mt-3 max-w-[24ch] font-display text-3xl leading-tight text-ink md:text-4xl">
              Two {companion.name}s are never the same {companion.name}.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
              Every companion is born with hidden tendencies — curiosity, courage, energy,
              clinginess, mischief. You never see the numbers. One {companion.name} might climb
              everything and fear nothing. Yours might nap through the whole thing and hide from
              your cursor. You find out by living together.
            </p>
            <p className="mt-6">
              <Link href="/my-companions" className="text-sm text-moss underline underline-offset-4">
                Where you figure out who you got
              </Link>
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16 md:px-10">
          <p className="kicker">Secrets</p>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">They keep a few things to themselves.</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {companion.secrets.map((secret) => (
              <div key={secret} className="rounded-[1.4rem] bg-cream p-5 ring-1 ring-ink/10">
                <p className="font-display text-2xl text-ink/40">???</p>
                <p className="mt-1 text-sm text-ink-soft">Discovered by living with them. Not by reading this page.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24 md:px-10">
          <p className="kicker">Stuff they love</p>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
            Give them things. They become new things {companion.name} can do.
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {suggestions.slice(0, 6).map((item) => (
              <ProductCard key={item.id} item={item} href={hrefForItem(item)} />
            ))}
          </div>
        </section>
      </div>
    </ShowreelCanvas>
  );
}
