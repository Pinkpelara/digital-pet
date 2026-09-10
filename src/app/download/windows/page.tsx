import Link from "next/link";
import { Creature } from "@/components/creatures/Creature";

export const metadata = { title: "Desktop app for Windows" };

export default function WindowsDownloadPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <p className="kicker">Not available yet</p>
      <h1 className="mt-2 font-display text-5xl text-ink">No Windows installer exists yet.</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Desktop roaming is the future flagship experience and it is still being built. Adopt on the
        web today — nothing you own will be left behind.
      </p>
      <div className="card mt-8 flex items-center gap-4 p-6">
        <Creature species="niblet" size={110} mood="happy" decorative />
        <p className="text-ink-soft">
          Work PCs that block installers can use the browser version. Same companions, same account.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/browser" className="btn btn-primary">
          Add to browser
        </Link>
        <Link href="/live" className="btn btn-ghost">
          See where they live
        </Link>
      </div>
    </div>
  );
}
