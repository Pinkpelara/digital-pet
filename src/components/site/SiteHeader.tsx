"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { brand, navLinks } from "@/lib/brand";
import { useNest } from "@/lib/state/nest-context";

export function SiteHeader() {
  const pathname = usePathname();
  const params = useSearchParams();
  const { user, creaturesEnabled, instances } = useNest();
  const paused = params.get("pause") === "1" || !creaturesEnabled;
  const home = pathname === "/";

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md ${
        home ? "border-white/5 bg-void/55 text-paper" : "border-ink/8 bg-paper/80 text-ink"
      }`}
    >
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-moss focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-display text-[1.65rem] tracking-tight">{brand.name}</span>
          <span className={`hidden text-xs uppercase tracking-[0.22em] sm:inline ${home ? "text-mist/70" : "text-ink-soft"}`}>
            {brand.tagline}
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
                  active
                    ? home
                      ? "bg-paper text-void"
                      : "bg-ink text-paper"
                    : home
                      ? "text-mist/80 hover:text-paper"
                      : "text-ink-soft hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={paused ? "/" : "/?pause=1"}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              home ? "border-white/15 text-mist/80" : "border-ink/10 text-ink-soft"
            }`}
            aria-label={paused ? "Let creatures roam" : "Pause roaming creatures"}
          >
            {paused ? "Roam" : "Pause"}
          </Link>
          <Link
            href="/my-companions"
            className={`rounded-full px-3 py-1.5 text-sm ${home ? "bg-paper text-void" : "bg-ink text-paper"}`}
          >
            {instances.length > 0 ? `Nest (${instances.length})` : "My nest"}
          </Link>
          <Link href={user ? "/inventory" : "/login"} className={`hidden text-sm sm:inline ${home ? "text-mist/70" : "text-ink-soft"}`}>
            {user ? user.displayName : "Sign in"}
          </Link>
        </div>
      </div>
      <nav
        aria-label="Store sections"
        className={`flex gap-2 overflow-x-auto border-t px-4 py-2 lg:hidden ${home ? "border-white/5" : "border-ink/5"}`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-full px-3 py-1 text-sm ${home ? "bg-white/8 text-paper" : "bg-cream text-ink"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
