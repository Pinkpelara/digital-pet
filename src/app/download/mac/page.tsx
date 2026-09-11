import Link from "next/link";

export const metadata = { title: "Download for Mac" };

export default function MacDownloadPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">macOS · optional</p>
      <h1 className="mt-2 font-display text-5xl text-ink">A menu-bar creature, soon.</h1>
      <p className="mt-4 text-ink-soft">
        No .dmg yet. Adopt on the web first — that is the real product today. If you cannot install apps,{" "}
        <Link href="/browser" className="underline">
          add them to your browser
        </Link>
        .
      </p>
      <p className="mt-3 text-ink-soft">
        The desktop client will read the same nest. The link below is only for people who already have a test build.
      </p>
      <a href="companions://download/mac" className="mt-6 inline-block rounded-full bg-cream px-5 py-3 text-ink">
        Open if already installed
      </a>
      <p className="mt-6">
        <Link href="/live" className="text-moss underline">
          See all three homes
        </Link>
      </p>
    </div>
  );
}
