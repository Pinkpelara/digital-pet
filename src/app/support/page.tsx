import { brand } from "@/lib/brand";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = { title: "Support" };

const faqs = [
  {
    q: "Did I buy a file?",
    a: "No. What you bought lives in your account, like a game inventory — not a file you download and copy around.",
  },
  {
    q: "Do I have to install something?",
    a: "No. The website is the home. You can pin this site in Chrome or Edge (helpful on work computers). A Windows/Mac app is optional and not ready yet. Nothing is a loot box, and nothing is required after you adopt.",
  },
  {
    q: "Can I gift a companion?",
    a: "Yes — try /gift/WELCOME-BLOOP in demo mode.",
  },
  {
    q: "Are there loot boxes?",
    a: "Never. Limited drops are timed, priced, and listed. What you see is what you pay.",
  },
  {
    q: "Can I buy a personality?",
    a: "No. Who they are is decided when you adopt, and you find it out by living with them. Gadgets and skills change what they can do.",
  },
];

export default function SupportPage() {
  return (
    <div className="bg-paper pb-20">
      <PageHero
        kicker="Support"
        title="We are here."
        lede={`Write ${brand.supportEmail}. Demo mode needs no ticket — it runs without Stripe or Supabase keys.`}
      />
      <dl className="mx-auto max-w-2xl space-y-8 px-5 md:px-10">
        {faqs.map((faq) => (
          <div key={faq.q} className="rounded-[1.4rem] bg-mist px-6 py-6 ring-1 ring-ink/10">
            <dt className="font-display text-2xl text-ink">{faq.q}</dt>
            <dd className="mt-2 text-ink-soft">{faq.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
