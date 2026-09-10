"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Creature } from "@/components/creatures/Creature";
import { brand, navLinks } from "@/lib/brand";
import { useNest } from "@/lib/state/nest-context";
import { useReducedMotion } from "@/components/site/use-reduced-motion";

export function SiteHeader() {
  const pathname = usePathname();
  const { user, creaturesEnabled, setCreaturesEnabled, instances } = useNest();
  const reducedMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-paper/85 backdrop-blur-md">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-moss focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group relative flex items-end gap-2 text-ink">
          <span className="font-display text-2xl tracking-tight">{brand.name}</span>
          <span className="hidden text-sm text-ink-soft sm:inline">{brand.tagline}</span>
          <span className="nav-perch absolute -right-10 -top-3 hidden sm:block">
            <Creature
              species="bloop"
              size={54}
              mood={creaturesEnabled && !reducedMotion ? "idle" : "idle"}
              equipped={{ body: "outfit-raincoat" }}
              reducedMotion={reducedMotion || !creaturesEnabled}
              decorative
            />
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  active ? "bg-moss text-paper" : "text-ink-soft hover:bg-cream hover:text-ink"
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
            className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink-soft hover:border-ink/30"
            onClick={() => setCreaturesEnabled(!creaturesEnabled)}
            aria-pressed={!creaturesEnabled}
          >
            {creaturesEnabled ? "Pause creatures" : "Let them roam"}
          </button>
          <Link
            href="/my-companions"
            className="rounded-full bg-ink px-3 py-1.5 text-sm text-paper hover:bg-ink/90"
          >
            {instances.length > 0 ? `Nest (${instances.length})` : "My nest"}
          </Link>
          <Link href={user ? "/inventory" : "/login"} className="hidden text-sm text-ink-soft sm:inline">
            {user ? user.displayName : "Sign in"}
          </Link>
        </div>
      </div>
      <nav aria-label="Store sections" className="flex gap-2 overflow-x-auto border-t border-ink/5 px-4 py-2 lg:hidden">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="shrink-0 rounded-full bg-cream px-3 py-1 text-sm text-ink">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
