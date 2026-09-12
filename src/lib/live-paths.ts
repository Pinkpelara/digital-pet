import { studioHref } from "@/lib/catalog-paths";

export type LivePathId = "website" | "browser" | "desktop";

export type LivePath = {
  id: LivePathId;
  kicker: string;
  title: string;
  body: string;
  href: (instanceId?: string) => string;
  cta: string;
  badge: string;
  ready: boolean;
};

export const livePaths: LivePath[] = [
  {
    id: "website",
    kicker: "Home",
    title: "On the website",
    body: "They already live in My companions. Visit them, dress them, teach them tricks — any computer with a browser.",
    href: (instanceId) => (instanceId ? studioHref(instanceId) : "/my-companions"),
    cta: "Open your companions",
    badge: "Ready now",
    ready: true,
  },
  {
    id: "browser",
    kicker: "The corner of your screen",
    title: "Beside your tabs",
    body: "Pin this site in Chrome or Edge and they sit next to your work. You write, they wander. No install, nothing for IT to approve.",
    href: () => "/browser",
    cta: "Keep them in the corner",
    badge: "Ready now",
    ready: true,
  },
  {
    id: "desktop",
    kicker: "The dream",
    title: "The whole desktop",
    body: "The big version: a creature that walks across your real Windows or Mac desktop, over your windows, asleep by the clock. Not ready yet — when it is, they move in with everything they own.",
    href: () => "/desktop",
    cta: "See the plan",
    badge: "Later",
    ready: false,
  },
];

export function liveIntro(name?: string): { title: string; lede: string } {
  if (name) {
    return {
      title: `Where does ${name} live?`,
      lede: `${name} already belongs to you. Picking a place only changes where they appear — it is never another purchase.`,
    };
  }
  return {
    title: "Where should they live?",
    lede: "Your companions already belong to you. Pick one home or several — the website is home, the browser keeps them in your corner, and the desktop app is the dream.",
  };
}
