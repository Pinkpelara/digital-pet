import { brand } from "@/lib/brand";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-5xl text-ink">Terms</h1>
      <div className="mt-6 space-y-4 text-ink-soft">
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
