import { brand } from "@/lib/brand";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">About</p>
      <h1 className="mt-2 font-display text-5xl text-ink">They were already on the sill.</h1>
      <div className="mt-6 space-y-4 text-lg text-ink-soft">
        <p>
          {brand.name} is a digital companion studio. You do not download a pet file. You adopt an entitlement — a
          creature, a raincoat, a moonwalk — and it lives in your account inventory like a Roblox backpack that grew a
          pulse.
        </p>
        <p>
          The website is their world. The desktop app (forthcoming) is how they wander your real screen. Same nest.
          Same ownership. No loot boxes. Fixed prices. Accounts and payments are for adults; the tone is for anyone {brand.ageGate}.
        </p>
        <p>{brand.audienceNote}</p>
      </div>
    </article>
  );
}
