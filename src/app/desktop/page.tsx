import Link from "next/link";
import { openDesktopHome } from "@/lib/deep-link";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = { title: "Desktop — the dream" };

export default function DesktopPage() {
  return (
    <div className="bg-paper pb-20">
      <PageHero
        kicker="The dream"
        title="Eventually they roam the whole computer."
        lede="Bloop walking across your actual desktop. Over your windows, along the taskbar, asleep by the clock. That is where this is going — he is just not packed yet."
      />
      <div className="mx-auto max-w-3xl px-5 md:px-10">
      <p className="text-ink-soft">
        When he moves in, nothing resets. Same name, same tricks, same raincoat, same favourite
        spots. The website and the desktop are just two rooms he lives in.
      </p>
      <p className="mt-3 text-ink-soft">
        Today he lives here — and he can already sit in the corner of your screen while you work.
        No install, no IT ticket.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/browser" className="rounded-full bg-ink px-5 py-3 text-paper">
          Keep them in your browser
        </Link>
        <Link href="/skills" className="rounded-full border border-ink/15 px-5 py-3 text-ink">
          Teach Moonwalk
        </Link>
        <Link href="/download/windows" className="rounded-full border border-ink/15 px-5 py-3 text-ink">
          Windows
        </Link>
        <Link href="/download/mac" className="rounded-full border border-ink/15 px-5 py-3 text-ink">
          Mac
        </Link>
        <a href={openDesktopHome()} className="rounded-full bg-cream px-5 py-3 text-ink ring-1 ring-ink/10">
          Open the app
        </a>
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        The Windows and Mac apps are not ready yet. When they are, your companions move in with
        everything they own. The last button opens the app if you somehow already have it.
      </p>
      <p className="mt-8 text-ink-soft">
        <Link href="/live" className="underline">
          See everywhere they can live
        </Link>
      </p>
      </div>
    </div>
  );
}
