import Link from "next/link";
import { brand } from "@/lib/brand";

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
    title: "Your nest",
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
      { href: "/admin", label: "Admin" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-void text-mist">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-3xl text-paper">{brand.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist/70">{brand.hero}</p>
        </div>
        {footer.map((column) => (
          <div key={column.title}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-mist/40">{column.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-mist/75 hover:text-paper">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 px-4 py-4 text-center text-xs text-mist/40">
        {brand.audienceNote}
      </div>
    </footer>
  );
}
