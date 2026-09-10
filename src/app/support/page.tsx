import { brand } from "@/lib/brand";

export const metadata = { title: "Support" };

const faqs = [
  {
    q: "Am I buying a file?",
    a: "No. You get a permanent entitlement in your account. There is no zip, no model file, and nothing to lose in your downloads folder.",
  },
  {
    q: "Can I choose its personality?",
    a: "No, and that is the point. You adopt an individual and discover who it is. You can influence what it does — a hammock means naps, a skateboard means skating — but you cannot buy 'sleepy'.",
  },
  {
    q: "Do I have to install anything?",
    a: "No. The website is home. Browser install works where your browser supports it. The desktop app is not ready and we are not pretending otherwise.",
  },
  {
    q: "Can I gift a companion?",
    a: "Yes — try /gift/WELCOME-BLOOP or /gift/TINY-PROBLEM.",
  },
  {
    q: "Are there loot boxes or a currency?",
    a: "Never. Fixed prices, permanent ownership, limited drops that end when they end.",
  },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="kicker">Support</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Questions, answered quickly.</h1>
      <p className="mt-3 text-ink-soft">
        Write {brand.supportEmail}. Demo mode needs no keys — it runs without Stripe or Supabase.
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
