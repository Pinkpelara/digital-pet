import Link from "next/link";
import { Creature } from "@/components/creatures/Creature";

export const metadata = { title: "Desktop app" };

export default function DesktopPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-10">
      <p className="kicker">Future flagship · not shipped</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Eventually, they roam your whole computer.</h1>
      <p className="mt-4 text-lg text-ink-soft">
        The version we are building towards is a transparent companion that walks across your desktop
        — over your windows, along the edges, asleep on your dock. That is the flagship experience.
        It is not finished, and there is nothing to download.
      </p>

      <div className="card mt-10 overflow-hidden">
        <div className="flex items-center gap-2 bg-cream px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-blush" />
          <span className="h-3 w-3 rounded-full bg-gold" />
          <span className="h-3 w-3 rounded-full bg-moss" />
          <span className="ml-2 text-xs uppercase tracking-wider text-ink-soft">concept</span>
        </div>
        <div className="relative h-56 bg-sky/10">
          <div className="absolute left-6 top-6 h-16 w-28 rounded-lg bg-white/80 ring-1 ring-ink/10" />
          <div className="absolute right-10 top-8 h-24 w-24 rounded-lg bg-white/80 ring-1 ring-ink/10" />
          <div className="absolute bottom-5 left-1/2 h-10 w-1/2 -translate-x-1/2 rounded-2xl bg-white/80 ring-1 ring-ink/10" />
          <div className="absolute bottom-12 left-12" aria-hidden="true">
            <Creature species="bloop" size={70} mood="walk" decorative />
          </div>
          <div className="absolute bottom-6 right-16" aria-hidden="true">
            <Creature species="mochi" size={66} mood="nap" decorative />
          </div>
        </div>
      </div>

      <h2 className="mt-10 font-display text-3xl text-ink">What exists today</h2>
      <ul className="mt-4 space-y-3 text-ink-soft">
        <li>· The website. They live in My companions. This works now.</li>
        <li>· Browser install, where your browser supports it. Also works now.</li>
        <li>· Desktop roaming. Prototype. Not released. No installer exists.</li>
      </ul>

      <p className="mt-8 text-ink-soft">
        We are not shipping a fake download button. When there is a build, this page will say so.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/live" className="btn btn-primary">
          See all three homes
        </Link>
        <Link href="/browser" className="btn btn-ghost">
          Add to browser instead
        </Link>
      </div>
    </div>
  );
}
