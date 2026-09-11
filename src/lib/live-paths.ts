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
    title: "Add to my browser",
    body: "Pin this site like an app in Chrome or Edge, or add it to your phone’s home screen. A browser extension is coming later — you do not need it yet.",
    href: () => "/browser",
    cta: "Add to browser",
    badge: "No IT install",
    ready: true,
  },
  {
    id: "desktop",
    kicker: "Optional · coming soon",
    title: "Get the desktop app",
    body: "For people who want a creature on the real Windows or Mac desktop. Not required. Work PCs that block installers can skip this entirely.",
    href: () => "/desktop",
    cta: "See desktop options",
    badge: "Upgrade",
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
    lede: "You already own your companions. Pick one home or several. The website is the default. The browser pin is live. Desktop roaming is coming — we are not pretending it exists yet.",
  };
}
