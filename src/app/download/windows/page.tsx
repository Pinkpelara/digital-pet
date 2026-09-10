export const metadata = { title: "Download for Windows" };

export default function WindowsDownloadPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">Windows</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Installer coming to this sill.</h1>
      <p className="mt-4 text-ink-soft">
        The Tauri desktop app is not part of this website MVP. Leave your email with support if you want the first
        build. Meanwhile, entitlements you buy here will already be waiting in your nest.
      </p>
      <a href="companions://download/windows" className="mt-6 inline-block rounded-full bg-ink px-5 py-3 text-paper">
        companions://download/windows
      </a>
    </div>
  );
}
