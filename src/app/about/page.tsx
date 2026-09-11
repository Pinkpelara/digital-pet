import Link from "next/link";
import { TEMP_BRAND_NAME, brand } from "@/lib/brand";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <article className="bg-paper pb-20">
      <PageHero
        kicker="About"
        title="Companions that actually live with you."
        lede={
          <>
            {brand.meetBody} {brand.heroSupport}
          </>
        }
      />
      <div className="mx-auto max-w-2xl space-y-4 px-5 text-lg text-ink-soft md:px-10">
        <p>
          They sulk if you disappear. They wait. There is no lethal neglect. Mute chaos is one tap;
          Goose-mode is an opt-in Teach, never the default. We are not promising a robot that lives
          in your house.
        </p>
        <p>
          Dress it, hand it objects that change what it gets up to, teach it tricks. Two people can
          adopt the same species and end up with completely different problems. {brand.closer}
        </p>
        <p>
          Today they live on this website. You can also add the site to your browser where supported.
          The big version — a companion roaming across your whole desktop — is being built and is not
          finished yet.
        </p>
        <p>
          Ownership is permanent and lives in your account, like a game inventory. No loot boxes, no
          currency, no downloadable files, no social feed. Accounts and payments are for adults; the
          tone is for anyone {brand.ageGate}.
        </p>
        <p>The name {TEMP_BRAND_NAME} is temporary while the brand is being decided.</p>
        <p className="pt-4">
          <Link href="/live" className="text-moss underline">
            Where can they live?
          </Link>
        </p>
      </div>
    </article>
  );
}
