export const metadata = { title: "Download for Mac" };

export default function MacDownloadPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">macOS</p>
      <h1 className="mt-2 font-display text-5xl text-ink">A menu-bar creature, soon.</h1>
      <p className="mt-4 text-ink-soft">
        No .dmg yet — this is a stub so the path exists. Adopt on the web first. The desktop client will read the same
        inventory.
      </p>
      <a href="companions://download/mac" className="mt-6 inline-block rounded-full bg-ink px-5 py-3 text-paper">
        companions://download/mac
      </a>
    </div>
  );
}
