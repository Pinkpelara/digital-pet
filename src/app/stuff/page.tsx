import Link from "next/link";
import { PageHero } from "@/components/site/KineticTitle";
import { categoryCopy } from "@/lib/catalog-paths";

const shelves = [
  {
    kind: "outfit" as const,
    href: "/closet",
    shelf: "How they look",
    note: "Raincoats, hats, ridiculous glasses. Dressing them changes the silhouette, not the soul.",
  },
  {
    kind: "gadget" as const,
    href: "/gadgets",
    shelf: "What they can do",
    note: "A skateboard means he skates. A hammock means nap o'clock anywhere. Gadgets become part of their day.",
  },
  {
    kind: "skill" as const,
    href: "/skills",
    shelf: "What you taught them",
    note: "Teach one and they know it forever — and show off when you least expect it.",
  },
  {
    kind: "drop" as const,
    href: "/drops",
    shelf: "Limited runs",
    note: "Seasonal sets in short windows. When a drop closes, it closes.",
  },
];

export const metadata = { title: "Their stuff" };

export default function StuffPage() {
  return (
    <div className="bg-paper pb-20">
      <PageHero
        kicker="Their stuff"
        title="Things you give them. Things they become."
        lede="You will see a ridiculous raincoat and think: my pet needs that. That feeling is the whole shop."
      />
      <div className="mx-auto grid max-w-6xl gap-5 px-5 md:grid-cols-2 md:px-10">
        {shelves.map((shelf) => {
          const copy = categoryCopy(shelf.kind);
          return (
            <Link
              key={shelf.kind}
              href={shelf.href}
              className="rounded-[1.6rem] bg-cream p-7 ring-1 ring-ink/10 transition hover:-translate-y-1 hover:ring-ink/25"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-moss">{shelf.shelf}</p>
              <h2 className="mt-2 font-display text-3xl text-ink">{copy.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{shelf.note}</p>
              <p className="mt-5 text-sm text-moss underline underline-offset-4">Browse {copy.title.toLowerCase()}</p>
            </Link>
          );
        })}
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-5 text-sm text-ink-soft md:px-10">
        Everything is owned permanently on your account, like a backpack in a game. Fixed prices,
        real money, no fake currency, no loot boxes.
      </p>
    </div>
  );
}
