import Link from "next/link";
import { Creature } from "@/components/creatures/Creature";
import { TEMP_BRAND_NAME } from "@/lib/brand";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16">
      <p className="kicker">About</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Tiny creatures that actually live with you.</h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
        <p>
          You adopt one, give it a name, and then find out who it is. Its personality was decided
          when you adopted it — you did not choose it, and you cannot edit it. You meet it.
        </p>
        <p>
          Dress it, hand it objects that change what it gets up to, teach it tricks. Two people can
          adopt the same species and end up with completely different problems. That comparison is
          the fun part.
        </p>
        <p>
          Today they live on this website. You can also add the site to your browser where supported.
          The big version — a companion roaming across your whole desktop — is being built and is not
          finished yet.
        </p>
        <p>
          Ownership is permanent and lives in your account, like a game inventory. No loot boxes, no
          currency, no downloadable files, no social feed. Accounts and payments are for adults; the
          tone is for anyone.
        </p>
      </div>
      <div className="mt-10 flex items-start gap-4">
        <Creature species="mochi" size={110} mood="nap" decorative />
        <p className="text-ink-soft">
          The name {TEMP_BRAND_NAME} is temporary while the brand is being decided.
        </p>
      </div>
      <p className="mt-8">
        <Link href="/live" className="font-semibold text-moss underline underline-offset-4">
          Where can they live?
        </Link>
      </p>
    </article>
  );
}
