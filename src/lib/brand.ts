/**
 * TEMPORARY BRANDING — DO NOT SCATTER BRAND STRINGS.
 *
 * The final product name has not been chosen yet. This file is the single
 * source of truth: replace TEMP_BRAND_NAME (and, if needed, the strings below)
 * and every visible surface updates.
 *
 * Migration note: the previous working name was "Sillkin". User-visible copy
 * no longer uses that name or its abstract language.
 */

export const TEMP_BRAND_NAME = "Companions";

export const brand = {
  name: TEMP_BRAND_NAME,
  domain: "companions.app",
  tagline: "Companions that live with you.",
  heroHeadline: "They live on your screen now.",
  heroSub: "Adopt one. Name it. Who they are shows up while you live together.",
  heroSupport: "You do not choose its personality. You meet it.",
  hero:
    "They live on your screen now. Adopt one. Name it. Who they are shows up while you live together. You do not choose its personality. You meet it.",
  meetBody: "Adopt one. Name it. Who they are shows up while you live together.",
  shopBody: "Raincoat. Pocket Umbrella. If you can’t see it in a second, we don’t sell it.",
  freeMagicBody: "Birthdays and noticing your day stay gifts. You can’t buy those.",
  closer: "Same species. Never the same one.",
  bottomCta: "Adopt one",
  bottomSupport: "Adopt one. Name it. Who they are shows up while you live together.",
  concept: ["Adopt", "Discover", "Make it yours", "Let it loose"] as const,
  deepLinkScheme: "companions",
  supportEmail: "hello@companions.app",
  ageGate: "13+",
  audienceNote:
    "General audience. Accounts and payments are for adults. No kids chat, no social feed, no loot boxes — just fixed, transparent prices.",
};

export const navLinks = [
  { href: "/companions", label: "Companions" },
  { href: "/closet", label: "Closet" },
  { href: "/gadgets", label: "Gadgets" },
  { href: "/skills", label: "Skills" },
  { href: "/drops", label: "Drops" },
] as const;

export const nestLinks = [
  { href: "/my-companions", label: "My companions" },
  { href: "/inventory", label: "Inventory" },
  { href: "/live", label: "Where they live" },
] as const;
