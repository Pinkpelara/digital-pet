import { brand } from "@/lib/brand";

export const metadata = { title: "Support" };

const faqs = [
  {
    q: "Did I buy a file?",
    a: "No. You bought a digital entitlement stored on your account. The creature is not a downloadable asset you copy around.",
  },
  {
    q: "Do I have to install something?",
    a: "No. The website is the home. You can pin Sillkin in Chrome or Edge (helpful on work computers). A Windows/Mac app is optional and not ready yet. Nothing is a loot box, and nothing is required after you adopt.",
  },
  {
    q: "Can I gift a companion?",
    a: "Yes — try /gift/WELCOME-BLOOP in demo mode.",
  },
  {
    q: "Are there loot boxes?",
    a: "Never. Limited drops are timed, priced, and listed. What you see is what you pay.",
  },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">Support</p>
      <h1 className="mt-2 font-display text-5xl text-ink">We are here. Softly.</h1>
      <p className="mt-3 text-ink-soft">
        Write {brand.supportEmail}. Demo mode needs no ticket — it runs without Stripe or Supabase keys.
      </p>
      <dl className="mt-10 space-y-6">
        {faqs.map((faq) => (
          <div key={faq.q}>
            <dt className="font-display text-2xl text-ink">{faq.q}</dt>
            <dd className="mt-2 text-ink-soft">{faq.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
