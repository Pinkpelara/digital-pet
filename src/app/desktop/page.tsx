import Link from "next/link";
import { openDesktopHome } from "@/lib/deep-link";

export const metadata = { title: "Desktop app" };

export default function DesktopPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">Future flagship · not shipped</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Eventually, they roam your whole computer.</h1>
      <p className="mt-4 text-lg text-ink-soft">
        The version we are building towards is a companion that walks across your desktop — over your
        windows, along the edges, asleep on your dock. That is the flagship experience. It is not
        finished, and we are not pretending it is.
      </p>
      <p className="mt-3 text-ink-soft">
        You do not need a desktop app to have a companion. The website is live. Pinning this site in
        a browser is the work-computer path. Installers are not ready yet. If you already have a test
        build, the deep link below opens it.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/download/windows" className="rounded-full bg-ink px-5 py-3 text-paper">
          Windows (coming soon)
        </Link>
        <Link href="/download/mac" className="rounded-full border border-ink/15 px-5 py-3 text-ink">
          macOS (coming soon)
        </Link>
        <a href={openDesktopHome()} className="rounded-full bg-cream px-5 py-3 text-ink">
          Open if already installed
        </a>
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        That last button uses <code>companions://</code>. If nothing is installed, your browser may look confused — that is
        expected.
      </p>
      <p className="mt-8 text-ink-soft">
        <Link href="/live" className="underline">
          See all three homes
        </Link>
        {" · "}
        <Link href="/browser" className="underline">
          Add to browser instead
        </Link>
      </p>
    </div>
  );
}
