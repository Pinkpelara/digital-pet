import Link from "next/link";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = { title: "Download for Mac" };

export default function MacDownloadPage() {
  return (
    <div className="bg-paper pb-20">
      <PageHero
        kicker="macOS · optional"
        title="A menu-bar companion, soon."
        lede="No installer yet. Adopt on the web first — that is the real product today."
      />
      <div className="mx-auto max-w-xl px-5 md:px-10">
        <p className="text-ink-soft">
          If you cannot install apps,{" "}
          <Link href="/browser" className="underline">
            add them to your browser
          </Link>
          .
        </p>
        <p className="mt-3 text-ink-soft">
          The desktop client will read the same nest. The link below is only for people who already have a test build.
        </p>
        <a href="companions://download/mac" className="mt-6 inline-block rounded-full bg-mist px-5 py-3 text-ink ring-1 ring-ink/10">
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
