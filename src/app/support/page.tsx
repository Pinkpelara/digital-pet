import { brand } from "@/lib/brand";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = { title: "Support" };

const faqs = [
  {
    q: "What exactly do I own?",
    a: "A companion or item that lives on your account forever — like a backpack in a game. Nothing to download, nothing to lose, nothing that expires.",
  },
  {
    q: "Do I have to install something?",
    a: "No. The website is their home. You can pin this site in Chrome or Edge so they sit in the corner of your screen while you work. A Windows/Mac app is the dream — not ready yet, never required.",
  },
  {
    q: "Can I gift a companion?",
    a: "Yes. They get a link, a parcel shakes, something climbs out, they name it. Try the sample gift: /gift/WELCOME-BLOOP.",
  },
  {
    q: "Are there loot boxes?",
    a: "Never. Limited drops are timed, priced, and listed. What you see is what you pay.",
  },
  {
    q: "Do they die if I forget them?",
    a: "No. Nothing bad happens while you are away. Come back in three weeks and they are just there — possibly up to something.",
  },
  {
    q: "Can I name them?",
    a: "Yes. A box arrives, they climb out, you name them, they're yours.",
  },
];

export default function SupportPage() {
  return (
    <div className="bg-paper pb-20">
      <PageHero
        kicker="Support"
        title="We are here."
        lede={`Write ${brand.supportEmail}. A person reads it.`}
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
