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
  tagline: "A little creature that lives on your screen.",
  heroHeadline: "A little creature that lives on your screen.",
  heroSub:
    "Not a game to maintain. Not a chatbot to talk at. You adopt one, name it, and find out who it is.",
  hero: "A little creature that lives on your screen. Adopt one. Name it. Find out who it is.",
  meetBody: "Adopt one. Name it. Find out who you got.",
  shopBody: "Outfits change how they look. Gadgets change what they do. Skills are tricks you taught them.",
  cameraLine: "Give them the camera. It’s still theirs tomorrow.",
  closer: "Same species. Never the same one.",
  bottomCta: "Adopt one",
  bottomSupport: "From $5.99. Yours forever.",
  concept: ["Adopt", "Meet", "Dress", "Live"] as const,
  deepLinkScheme: "companions",
  supportEmail: "hello@companions.app",
  ageGate: "13+",
  audienceNote:
    "General audience. Accounts and payments are for adults. No kids chat, no social feed, no loot boxes — just fixed, transparent prices.",
};

export const navLinks = [
  { href: "/companions", label: "Companions" },
  { href: "/stuff", label: "Their stuff" },
] as const;

export const nestLinks = [
  { href: "/my-companions", label: "My companions" },
  { href: "/inventory", label: "Inventory" },
  { href: "/live", label: "Where they live" },
] as const;
