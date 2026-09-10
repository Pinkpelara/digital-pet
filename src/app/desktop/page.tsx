import Link from "next/link";
import { openDesktopHome } from "@/lib/deep-link";

export const metadata = { title: "Desktop" };

export default function DesktopPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">Desktop companions</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Let them loose on your computer.</h1>
      <p className="mt-4 text-lg text-ink-soft">
        The website is the world and the shop. The desktop app — a future Tauri companion — is how they climb your real
        windows. This page is a honest stub: deep links work, installers do not yet.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/download/windows" className="rounded-full bg-ink px-5 py-3 text-paper">
          Windows
        </Link>
        <Link href="/download/mac" className="rounded-full border border-ink/15 px-5 py-3 text-ink">
          macOS
        </Link>
        <a href={openDesktopHome()} className="rounded-full bg-cream px-5 py-3 text-ink">
          Open companions://home
        </a>
      </div>
    </div>
  );
}
