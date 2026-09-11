import Link from "next/link";
import { openDesktopHome } from "@/lib/deep-link";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = { title: "Desktop app — coming later" };

export default function DesktopPage() {
  return (
    <div className="bg-paper pb-20">
      <PageHero
        kicker="Coming later"
        title="Eventually they roam the whole machine."
        lede="The version we are building toward walks across your real desktop — over windows, along the taskbar, asleep on the clock. It is not finished, and we are not selling an installer we do not have."
      />
      <div className="mx-auto max-w-3xl px-5 md:px-10">
      <p className="text-ink-soft">
        Nothing bad happens if you forget them. Loud mischief is always your choice, never the
        default.
      </p>
      <p className="mt-3 text-ink-soft">
        Today they live in the corner of a pinned browser: Chrome or Edge, no install, same account.
        Come back here when a test build exists.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/browser" className="rounded-full bg-ink px-5 py-3 text-paper">
          Pin them in the corner
        </Link>
        <Link href="/skills" className="rounded-full border border-ink/15 px-5 py-3 text-ink">
          Browse skills
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
