import Link from "next/link";
import { brand } from "@/lib/brand";
import { VoiceToggle } from "@/components/site/VoiceToggle";

const footer = [
  {
    title: "The world",
    links: [
      { href: "/companions", label: "Companions" },
      { href: "/drops", label: "Limited drops" },
      { href: "/about", label: "About" },
      { href: "/live", label: "Where they live" },
    ],
  },
  {
    title: "Yours",
    links: [
      { href: "/my-companions", label: "My companions" },
      { href: "/inventory", label: "Inventory" },
      { href: "/login", label: "Sign in" },
      { href: "/gift/WELCOME-BLOOP", label: "Redeem a gift" },
    ],
  },
  {
    title: "Care",
    links: [
      { href: "/support", label: "Support" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ink/10 bg-void text-ink">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-4xl text-ink">{brand.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">{brand.tagline}</p>
        </div>
        {footer.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-medium text-ink-soft">{column.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ink-soft hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink/8 px-4 py-4 text-center text-xs text-ink-soft">
        <p>{brand.audienceNote}</p>
        <p className="mt-2">Nothing bad happens when you are away.</p>
        <p className="mt-2">
          <VoiceToggle />
        </p>
      </div>
    </footer>
  );
}
