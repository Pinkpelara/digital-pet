import { brand } from "@/lib/brand";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <article className="bg-paper pb-20">
      <PageHero kicker="Care" title="Privacy" />
      <div className="mx-auto max-w-2xl space-y-4 px-5 text-ink-soft md:px-10">
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
