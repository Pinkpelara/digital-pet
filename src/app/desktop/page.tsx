import Link from "next/link";
import { openDesktopHome } from "@/lib/deep-link";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = { title: "Desktop app — coming later" };

export default function DesktopPage() {
  return (
    <div className="bg-paper pb-20">
      <PageHero
        kicker="Desktop · not shipped yet"
        title="Eventually they roam the whole computer."
        lede="The big idea: Bloop walks across your actual computer. Over your windows, along the dock, asleep on the clock. That version is a prototype. Right now he lives here on the website."
      />
      <div className="mx-auto max-w-3xl px-5 md:px-10">
      <p className="text-ink-soft">
        Mute chaos is always one tap. They do not starve. They do not die if you forget them.
      </p>
      <p className="mt-3 text-ink-soft">
        For work machines today, they live in the corner of a pinned browser. That is the real
        now-path: Chrome or Edge, no IT install, same nest. Come back here when a test build exists.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/browser" className="rounded-full bg-ink px-5 py-3 text-paper">
          Pin them in the corner
        </Link>
        <Link href="/skills" className="rounded-full border border-ink/15 px-5 py-3 text-ink">
          Teach Moonwalk
        </Link>
        <Link href="/download/windows" className="rounded-full border border-ink/15 px-5 py-3 text-ink">
          Windows (coming soon)
        </Link>
        <Link href="/download/mac" className="rounded-full border border-ink/15 px-5 py-3 text-ink">
          macOS (coming soon)
        </Link>
        <a href={openDesktopHome()} className="rounded-full bg-cream px-5 py-3 text-ink ring-1 ring-ink/10">
          Open if already installed
        </a>
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        That last button uses <code>companions://</code>. If nothing is installed, your browser may
        look confused — that is expected.
      </p>
      <p className="mt-8 text-ink-soft">
        <Link href="/live" className="underline">
          See all three homes
        </Link>
      </p>
      </div>
    </div>
  );
}
