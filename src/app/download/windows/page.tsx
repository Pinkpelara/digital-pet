import Link from "next/link";

export const metadata = { title: "Download for Windows" };

export default function WindowsDownloadPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">Windows · optional</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Installer coming to this sill.</h1>
      <p className="mt-4 text-ink-soft">
        You do not need this download to keep a companion. They already live on the website. If your work PC blocks
        installers,{" "}
        <Link href="/browser" className="underline">
          pin Sillkin in the browser
        </Link>{" "}
        instead.
      </p>
      <p className="mt-3 text-ink-soft">
        A Tauri desktop app is planned as an optional upgrade. Leave a note with support if you want the first build.
        The <code>companions://</code> link below only works if you already installed a test copy.
      </p>
      <a href="companions://download/windows" className="mt-6 inline-block rounded-full bg-cream px-5 py-3 text-ink">
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
