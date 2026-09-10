import { brand, TEMP_BRAND_NAME } from "@/lib/brand";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16">
      <p className="kicker">Privacy</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Privacy</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
        <p>
          {TEMP_BRAND_NAME} collects the minimum needed to run an account, a companion and a payment:
          email, auth provider, what you own, and how each companion is customized. We do not run a
          social feed, we do not sell profiles, and we do not build behaviour profiles for ads.
        </p>
        <p>
          Behaviour counters (how often a companion climbed, napped, followed your cursor) stay with
          your companion and are used to decide what you have discovered. Share cards only include
          what you choose to share.
        </p>
        <p>
          Payments are processed by Stripe. Auth can be Google, Apple, or email magic link. In demo
          mode, your data stays in this browser and a process-local server store.
        </p>
        <p>This page is a product-honest draft, not formal legal counsel. Contact {brand.supportEmail}.</p>
      </div>
    </article>
  );
}
