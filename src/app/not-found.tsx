import Link from "next/link";
import { Creature } from "@/components/creatures/Creature";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-20 text-center">
      <Creature species="sprout" size={160} mood="hide" decorative />
      <h1 className="mt-4 font-display text-4xl text-ink">They hid behind a 404.</h1>
      <p className="mt-3 text-ink-soft">
        Nothing lives on this page. Sprout is extremely pleased about it.
      </p>
      <Link href="/" className="btn btn-primary mt-6">
        Back to the companions
      </Link>
    </div>
  );
}
