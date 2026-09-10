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
    kicker: "Here · live now",
    title: "Keep them on the website",
    body: "They live in My companions. Open it, dress them, teach them things. No install, any computer with a browser.",
    href: (instanceId) => (instanceId ? studioHref(instanceId) : "/my-companions"),
    cta: "Open your companions",
    badge: "Live now",
    ready: true,
  },
  {
    id: "browser",
    kicker: "Also here · where supported",
    title: "Add to browser",
    body: "Install the web experience if your browser offers it, or keep a home-screen icon. Handy on work computers.",
    href: () => "/browser",
    cta: "Add to browser",
    badge: "Where supported",
    ready: true,
  },
  {
    id: "desktop",
    kicker: "Future flagship · not shipped",
    title: "Let them roam your desktop",
    body: "A transparent companion walking across your whole computer is the big version of this. It is still being built — nothing to download yet.",
    href: () => "/desktop",
    cta: "See the plan",
    badge: "Coming soon",
    ready: false,
  },
];

export function liveIntro(name?: string): { title: string; lede: string } {
  if (name) {
    return {
      title: `Where should ${name} live?`,
      lede: `${name} is already yours. Picking a place only changes where you see them — it is not another purchase.`,
    };
  }
  return {
    title: "Where should they live?",
    lede: "Your companions are yours either way. The website is home today, the browser is the install option, and desktop roaming is the future flagship experience.",
  };
}
