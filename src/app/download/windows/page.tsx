import Link from "next/link";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = { title: "Download for Windows" };

export default function WindowsDownloadPage() {
  return (
    <div className="bg-paper pb-20">
      <PageHero
        kicker="Windows · optional"
        title="Installer coming later."
        lede="You do not need this download to keep a companion. They already live on the website."
      />
      <div className="mx-auto max-w-xl px-5 md:px-10">
        <p className="text-ink-soft">
          If your work PC blocks installers,{" "}
          <Link href="/browser" className="underline">
            pin this site in the browser
          </Link>{" "}
          instead.
        </p>
        <p className="mt-3 text-ink-soft">
          A Tauri desktop app is planned as an optional upgrade. Leave a note with support if you want the first build.
          The <code>companions://</code> link below only works if you already installed a test copy.
        </p>
        <a href="companions://download/windows" className="mt-6 inline-block rounded-full bg-mist px-5 py-3 text-ink ring-1 ring-ink/10">
          Open if already installed
        </a>
        <p className="mt-6">
          <Link href="/live" className="text-moss underline">
            See all three homes
          </Link>
        </p>
      </div>
    </div>
  );
}
