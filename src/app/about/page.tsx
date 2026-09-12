import Link from "next/link";
import { brand } from "@/lib/brand";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <article className="bg-paper pb-20">
      <PageHero kicker="About" title="Companions that live with you." lede={brand.meetBody} />
      <div className="mx-auto max-w-2xl space-y-4 px-5 text-lg text-ink-soft md:px-10">
        <p>
          We make little digital creatures that live on your screen. You adopt one, give it a
          name, and figure out who it is — not from a settings page, but from living with it.
        </p>
        <p>
          One might follow your cursor everywhere. Another naps all afternoon and hides from loud
          clicks. Same species, different weirdos. You don&apos;t choose who they are. You meet them.
        </p>
        <p>
          Today they live on this website. Tomorrow, your whole desktop. Either way it is the same
          companion — same name, same tricks, same history.
        </p>
        <p className="pt-4">
          <Link href="/companions" className="text-moss underline">
            Adopt one
          </Link>
        </p>
      </div>
    </article>
  );
}
