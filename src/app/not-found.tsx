import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="kicker">404</p>
      <h1 className="mt-4 font-display text-4xl leading-[0.92] text-ink md:text-5xl">
        They hid behind this page.
      </h1>
      <p className="mt-3 text-ink-soft">
        This corner of the website is empty, and somebody is very pleased about that.
      </p>
      <Link href="/" className="mt-6 rounded-full bg-ink px-5 py-3 text-paper">
        Back to the world
      </Link>
    </div>
  );
}
