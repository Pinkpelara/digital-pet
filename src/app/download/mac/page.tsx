import Link from "next/link";
import { Creature } from "@/components/creatures/Creature";

export const metadata = { title: "Desktop app for Mac" };

export default function MacDownloadPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <p className="kicker">Not available yet</p>
      <h1 className="mt-2 font-display text-5xl text-ink">There is no Mac app to download.</h1>
      <p className="mt-4 text-lg text-ink-soft">
        We are not going to hand you a fake .dmg. Adopt on the web first — that is the real product
        today.
      </p>
      <div className="card mt-8 flex items-center gap-4 p-6">
        <Creature species="sprout" size={110} mood="idle" decorative />
        <p className="text-ink-soft">
          When desktop roaming ships, it will read the same account. Your companions will not need
          re-buying.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/browser" className="btn btn-primary">
          Add to browser instead
        </Link>
        <Link href="/live" className="btn btn-ghost">
          See where they live
        </Link>
      </div>
    </div>
  );
}
