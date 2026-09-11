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
    kicker: "Primary · ready now",
    title: "Keep them on the website",
    body: "They already live in My companions. Visit them, dress them, teach tricks — no install, any computer with a browser.",
    href: (instanceId) => (instanceId ? studioHref(instanceId) : "/my-companions"),
    cta: "Open your companions",
    badge: "Default",
    ready: true,
  },
  {
    id: "browser",
    kicker: "Work-friendly · ready now",
    title: "Lives in the corner while you work",
    body: "Pin this site in Chrome or Edge and they sit beside your tabs. No install, nothing for IT to approve. An extension comes later — you do not need it.",
    href: () => "/browser",
    cta: "Pin the browser",
    badge: "No IT install",
    ready: true,
  },
  {
    id: "desktop",
    kicker: "Optional · coming soon",
    title: "The whole desktop, later",
    body: "The big version is a creature that walks across your real Windows or Mac desktop. It is not shipped yet. Until then, pin the browser. Work computers that block installers can skip this entirely.",
    href: () => "/desktop",
    cta: "Read what exists",
    badge: "Not shipped",
    ready: false,
  },
];

export function liveIntro(name?: string): { title: string; lede: string } {
  if (name) {
    return {
      title: `Where does ${name} live?`,
      lede: `You already own ${name}. Choosing a place only changes where they appear — it is not another purchase, and nothing is required.`,
    };
  }
  return {
    title: "Where should they live?",
    lede: "You already own your companions. Pick one home or several. The website is the default. Pinning the browser is how they live in the corner while you work. Desktop roaming is coming — it does not exist yet.",
  };
}
