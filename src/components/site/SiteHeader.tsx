"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand, navLinks } from "@/lib/brand";
import { useNest } from "@/lib/state/nest-context";

export function SiteHeader() {
  const pathname = usePathname();
  const { user, instances, hydrated, creaturesEnabled, setCreaturesEnabled } = useNest();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-void/75 text-ink backdrop-blur-xl">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-moss focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-display text-[1.7rem] tracking-tight">{brand.name}</span>
          <span className="hidden text-sm text-ink-soft sm:inline">{brand.tagline}</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  active ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCreaturesEnabled(!creaturesEnabled)}
            className="hidden rounded-full px-3 py-1.5 text-sm text-ink-soft hover:text-ink sm:inline"
            aria-pressed={!creaturesEnabled}
          >
            {hydrated && !creaturesEnabled ? "Unmute chaos" : "Mute chaos"}
          </button>
          <Link
            href="/my-companions"
            className="rounded-full bg-ink px-3 py-1.5 text-sm text-paper"
            suppressHydrationWarning
          >
            {hydrated && instances.length > 0 ? `My companions (${instances.length})` : "My companions"}
          </Link>
          <Link
            href={user && hydrated ? "/inventory" : "/login"}
            className="hidden text-sm text-ink-soft sm:inline"
            suppressHydrationWarning
          >
            {hydrated && user ? user.displayName : "Sign in"}
          </Link>
        </div>
      </div>
      <nav aria-label="Store sections" className="flex gap-2 overflow-x-auto border-t border-ink/5 px-4 py-2 lg:hidden">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="shrink-0 rounded-full bg-cream px-3 py-1 text-sm text-ink ring-1 ring-ink/10">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
