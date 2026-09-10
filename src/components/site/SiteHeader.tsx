"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand, navLinks } from "@/lib/brand";
import { useNest } from "@/lib/state/nest-context";

export function SiteHeader() {
  const pathname = usePathname();
  const { user, instances, hydrated } = useNest();
  const cinematic =
    pathname === "/" ||
    pathname.startsWith("/companions") ||
    pathname.startsWith("/item") ||
    pathname.startsWith("/adopt");

  return (
    <header
      className={`${
        cinematic
          ? "absolute inset-x-0 top-0 z-40 border-transparent bg-gradient-to-b from-void/80 to-transparent text-paper"
          : "sticky top-0 z-40 border-b border-ink/8 bg-paper/80 text-ink backdrop-blur-md"
      }`}
    >
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-moss focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-display text-[1.7rem] tracking-tight">{brand.name}</span>
          <span className={`hidden text-xs uppercase tracking-[0.22em] sm:inline ${cinematic ? "text-mist/55" : "text-ink-soft"}`}>
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
                    ? cinematic
                      ? "bg-paper text-void"
                      : "bg-ink text-paper"
                    : cinematic
                      ? "text-mist/75 hover:text-paper"
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
            href="/my-companions"
            className={`rounded-full px-3 py-1.5 text-sm ${cinematic ? "bg-paper text-void" : "bg-ink text-paper"}`}
          >
            {hydrated && instances.length > 0 ? `Nest (${instances.length})` : "My nest"}
          </Link>
          <Link href={user && hydrated ? "/inventory" : "/login"} className={`hidden text-sm sm:inline ${cinematic ? "text-mist/65" : "text-ink-soft"}`}>
            {hydrated && user ? user.displayName : "Sign in"}
          </Link>
        </div>
      </div>
      <nav
        aria-label="Store sections"
        className={`flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden ${cinematic ? "" : "border-t border-ink/5 pt-2"}`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-full px-3 py-1 text-sm ${cinematic ? "bg-white/10 text-paper" : "bg-cream text-ink"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
