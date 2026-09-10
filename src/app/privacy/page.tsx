import { brand } from "@/lib/brand";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-5xl text-ink">Privacy</h1>
      <div className="mt-6 space-y-4 text-ink-soft">
        <p>
          {brand.name} collects the minimum needed to run an account, an inventory, and a payment:
          email, auth provider, what you own, and companion customization. We do not run a social
          feed. We do not sell profiles.
        </p>
        <p>
          Payments are processed by Stripe. Auth can be Google, Apple, or email magic link. In demo
          mode, data stays in this browser and a process-local server store.
        </p>
        <p>This page is a product-honest draft, not formal legal counsel.</p>
      </div>
    </article>
  );
}
