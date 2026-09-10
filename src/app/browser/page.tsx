import Link from "next/link";
import { PwaInstall } from "@/components/live/PwaInstall";

export const metadata = { title: "Add to your browser" };

export default function BrowserPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-10">
      <p className="kicker">Where supported</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Add them to your browser.</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Where your browser supports it, install this site as an app so your companions are one click
        away. Your companions already live in your account — this only makes them easier to open.
      </p>

      <section className="card mt-10 p-6">
        <h2 className="font-display text-3xl text-ink">Install</h2>
        <p className="mt-2 text-ink-soft">
          Chrome and Edge can offer a one-click install. Other browsers use a short menu path. If
          yours cannot install sites, nothing is broken.
        </p>
        <div className="mt-5">
          <PwaInstall />
        </div>
      </section>

      <section className="card mt-6 p-6">
        <h2 className="font-display text-3xl text-ink">Browser extension</h2>
        <p className="mt-2 text-ink-soft">
          <span className="mr-2 rounded-full bg-cream px-2 py-0.5 text-xs uppercase tracking-wider text-ink">
            Coming later
          </span>
          A small extension could perch a companion on any tab. It is not built yet, and you do not
          need it.
        </p>
      </section>

      <p className="mt-8 text-ink-soft">
        Prefer the full website?{" "}
        <Link href="/my-companions" className="underline">
          Open your companions
        </Link>
        . Curious about desktop roaming?{" "}
        <Link href="/desktop" className="underline">
          Read what exists
        </Link>
        .
      </p>
    </div>
  );
}
