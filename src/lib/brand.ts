export const brand = {
  name: "Sillkin",
  domain: "sillkin.app",
  tagline: "Soft volume for the edge of the screen.",
  hero: "Tiny creatures for your screen. Adopt one. Dress it. Teach it tricks. Keep them on the website, pin them in a browser, or optionally bring them to a desktop app.",
  concept: ["Adopt", "Customize", "Keep them close"] as const,
  deepLinkScheme: "companions",
  supportEmail: "hello@sillkin.app",
  ageGate: "13+",
  audienceNote:
    "Sillkin is a general-audience product. Accounts and payments are for adults. There is no kids chat, no social feed, and no loot boxes — just fixed, transparent prices.",
};

export const navLinks = [
  { href: "/companions", label: "Companions" },
  { href: "/closet", label: "Closet" },
  { href: "/gadgets", label: "Gadgets" },
  { href: "/skills", label: "Skills" },
  { href: "/personality", label: "Personality" },
  { href: "/drops", label: "Drops" },
] as const;

export const nestLinks = [
  { href: "/my-companions", label: "My companions" },
  { href: "/inventory", label: "Inventory" },
  { href: "/live", label: "Where they live" },
] as const;
