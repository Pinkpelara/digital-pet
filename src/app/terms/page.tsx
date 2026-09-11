import { brand } from "@/lib/brand";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <article className="bg-paper pb-20">
      <PageHero kicker="Care" title="Terms" />
      <div className="mx-auto max-w-2xl space-y-4 px-5 text-ink-soft md:px-10">
        <p>
          You are buying a license to use digital companions and items in {brand.name} products.
          Ownership is an entitlement we grant after a verified purchase — not a transfer of
          copyright, and not a loot box.
        </p>
        <p>
          Accounts and payment methods must belong to an adult. The experience is rated {brand.ageGate} /
          general audience. Do not use this product to create a kids social space; we will not ship
          one.
        </p>
        <p>Limited drops end. Prices on the page are the prices. This draft is not a substitute for counsel.</p>
      </div>
    </article>
  );
}
