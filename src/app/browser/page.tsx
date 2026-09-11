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
        kicker="The real now-path · work machines"
        title="Lives in the corner while you work."
        lede="Pin this site in Chrome or Edge and they sit beside your tabs. You write, they nap. You ignore them, they sulk. You look back, they noticed. Mute chaos anytime in the header."
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
          This is the honest path for a locked-down work computer. No IT ticket. Same inventory as the
          website. A full OS desktop pet is coming later — until then, the browser pin is the live
          product.
        </p>

        <section className="mt-10 rounded-[1.6rem] bg-mist p-6 ring-1 ring-ink/10">
          <h2 className="font-display text-3xl text-ink">Pin them here</h2>
          <p className="mt-2 text-ink-soft">
            Chrome and Edge can install this page as a slim window you leave in the corner. Other
            browsers get a short menu path. If yours cannot install sites, keep a tab pinned — they
            still live in your account.
          </p>
          <div className="mt-5">
            <PwaInstall />
          </div>
        </section>

        <section className="mt-8 rounded-[1.6rem] bg-mist p-6 ring-1 ring-ink/10">
          <h2 className="font-display text-3xl text-ink">Browser extension</h2>
          <p className="mt-2 text-ink-soft">
            <span className="mr-2 rounded-full bg-cream px-2 py-0.5 text-xs uppercase tracking-wider text-ink">
              Coming later
            </span>
            A browser extension could sit a companion on any tab. It is not built yet. You do not need it
            to have them in the corner today.
          </p>
        </section>

        <p className="mt-8 text-ink-soft">
          Want the full site?{" "}
          <Link href="/my-companions" className="underline">
            Open your companions
          </Link>
          . Curious about the future OS pet?{" "}
          <Link href="/desktop" className="underline">
            Desktop is coming — not here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
