import Link from "next/link";
import { PwaInstall } from "@/components/live/PwaInstall";

export const metadata = { title: "Add to your browser" };

export default function BrowserPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">Work-friendly</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Add Sillkin to your browser.</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Many work computers will not let you install a full desktop program. That is fine. Pin this website as an app or
        a home-screen icon. Your companions already live in the nest — this only makes them easier to open.
      </p>

      <section className="mt-10 rounded-[1.6rem] bg-paper p-6 ring-1 ring-ink/8">
        <h2 className="font-display text-3xl text-ink">Install Sillkin</h2>
        <p className="mt-2 text-ink-soft">Chrome and Edge can offer a one-click install. Other browsers use a short menu path.</p>
        <div className="mt-5">
          <PwaInstall />
        </div>
      </section>

      <section className="mt-8 rounded-[1.6rem] bg-cream/80 p-6 ring-1 ring-ink/8">
        <h2 className="font-display text-3xl text-ink">Browser extension</h2>
        <p className="mt-2 text-ink-soft">
          <span className="mr-2 rounded-full bg-ink/10 px-2 py-0.5 text-xs uppercase tracking-wider text-ink">Coming soon</span>
          A small extension could perch a creature on any tab. It is not built yet. You do not need it to use Sillkin
          today.
        </p>
      </section>

      <p className="mt-8 text-ink-soft">
        Prefer the full website?{" "}
        <Link href="/my-companions" className="underline">
          Open your nest
        </Link>
        . Curious about a real desktop window later?{" "}
        <Link href="/desktop" className="underline">
          Optional desktop app
        </Link>
        .
      </p>
    </div>
  );
}
