import Link from "next/link";
import { TEMP_BRAND_NAME, brand } from "@/lib/brand";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <article className="bg-paper pb-20">
      <PageHero kicker="About" title="Companions that live with you." lede={brand.meetBody} />
      <div className="mx-auto max-w-2xl space-y-4 px-5 text-lg text-ink-soft md:px-10">
        <p>
          A little digital creature you adopt, name, dress, and keep around your computer. Company
          you keep — not a game you maintain.
        </p>
        <p>
          Today they live here. Pin the site in a browser if you want them in the corner. A desktop
          roam is being built.
        </p>
        <p>The name {TEMP_BRAND_NAME} is temporary while the brand is being decided.</p>
        <p className="pt-4">
          <Link href="/companions" className="text-moss underline">
            Adopt one
          </Link>
        </p>
      </div>
    </article>
  );
}
