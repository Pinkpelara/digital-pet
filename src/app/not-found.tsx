import Link from "next/link";
import { Creature } from "@/components/creatures/Creature";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <Creature species="sprout" size={160} mood="hide" decorative />
      <h1 className="mt-4 font-display text-4xl text-ink">They hid behind a 404.</h1>
      <p className="mt-3 text-ink-soft">This corner of the page is empty. Sprout is very pleased about that.</p>
      <Link href="/" className="mt-6 rounded-full bg-ink px-5 py-3 text-paper">
        Back to the world
      </Link>
    </div>
  );
}
