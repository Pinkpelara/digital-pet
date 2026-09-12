import Link from "next/link";
import { PwaInstall } from "@/components/live/PwaInstall";
import { LiveStage } from "@/components/stage/LiveStage";
import { WhenVisible } from "@/components/site/WhenVisible";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = { title: "Lives in the corner while you work" };

export default function BrowserPage() {
  return (
    <div className="bg-paper pb-20">
      <PageHero
        kicker="No install needed"
        title="They can sit in the corner of your screen today."
        lede="Add this site to your browser and your companions hang out beside your tabs. You work, they wander. You look over, they are up to something."
      />
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <WhenVisible once className="stage-frame mb-10 min-h-[360px] overflow-hidden rounded-[1.8rem] md:min-h-[460px]">
          <LiveStage
            species="bloop"
            mood="climb"
            equipped={{ body: "outfit-raincoat" }}
            className="h-full min-h-[360px] w-full md:min-h-[460px]"
            cameraZ={5.5}
            followPointer
            quality="medium"
          />
        </WhenVisible>
        <p className="max-w-3xl text-ink-soft">
          Works on locked-down work computers — no downloads, no IT ticket. Same companions, same
          stuff, same history as the website. Nothing bad happens while you focus on something else.
        </p>

        <section className="mt-10 rounded-[1.6rem] bg-mist p-6 ring-1 ring-ink/10">
          <h2 className="font-display text-3xl text-ink">Give them a window</h2>
          <p className="mt-2 text-ink-soft">
            Chrome and Edge can turn this site into a slim window you leave in the corner. Other
            browsers take one extra menu step — the short version is below.
          </p>
          <div className="mt-5">
            <PwaInstall />
          </div>
        </section>

        <section className="mt-8 rounded-[1.6rem] bg-mist p-6 ring-1 ring-ink/10">
          <h2 className="font-display text-3xl text-ink">Following you from tab to tab</h2>
          <p className="mt-2 text-ink-soft">
            <span className="mr-2 rounded-full bg-cream px-2 py-0.5 text-xs uppercase tracking-wider text-ink">
              Later
            </span>
            A browser extension that puts a companion on any page you visit. We are working on it.
            You do not need it to keep them in the corner today.
          </p>
        </section>

        <p className="mt-8 text-ink-soft">
          <Link href="/my-companions" className="underline">
            Open your companions
          </Link>
          , or see{" "}
          <Link href="/desktop" className="underline">
            where this is all going
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
