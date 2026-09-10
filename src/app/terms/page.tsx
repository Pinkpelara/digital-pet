import { TEMP_BRAND_NAME } from "@/lib/brand";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16">
      <p className="kicker">Terms</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Terms</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
        <p>
          You are buying a licence to use digital companions and items inside {TEMP_BRAND_NAME}{" "}
          products. Ownership is an entitlement we grant after a verified purchase — not a transfer
          of copyright, and not a loot box.
        </p>
        <p>
          Each companion has a hidden personality generated at adoption. It is not selectable,
          editable, or purchasable, and no purchase changes it. Objects and skills change behaviour
          opportunities only.
        </p>
        <p>
          Accounts and payment methods must belong to an adult. The experience is general audience
          (13+). There is no kids chat, no feed, and no messaging, and we will not add one.
        </p>
        <p>Limited drops end. Prices on the page are the prices. This draft is not a substitute for counsel.</p>
      </div>
    </article>
  );
}
