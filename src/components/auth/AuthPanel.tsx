"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { useNest } from "@/lib/state/nest-context";

export function AuthPanel() {
  const router = useRouter();
  const { signInDemo, user } = useNest();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function finish(provider: "google" | "apple" | "magic-link" | "demo") {
    track("auth_started", { provider });
    signInDemo({
      provider,
      email: email || "you@companions.local",
      displayName: provider === "demo" ? "Explorer" : email.split("@")[0] || "Explorer",
    });
    router.push("/my-companions");
  }

  return (
    <div className="mx-auto max-w-md rounded-[2rem] bg-mist p-8 ring-1 ring-ink/10">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">No passwords</p>
      <p className="mt-3 text-ink-soft">
        Google, Apple, or an email magic link. Demo mode signs you in locally — no keys required.
      </p>
      {user && <p className="mt-3 text-sm text-moss">Already signed in as {user.displayName}.</p>}
      <div className="mt-6 space-y-3">
        <button type="button" onClick={() => finish("google")} className="w-full rounded-full bg-ink px-4 py-3 text-paper">
          Continue with Google
        </button>
        <button type="button" onClick={() => finish("apple")} className="w-full rounded-full border border-ink/15 px-4 py-3 text-ink">
          Continue with Apple
        </button>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
            window.setTimeout(() => finish("magic-link"), 600);
          }}
          className="space-y-3"
        >
          <label htmlFor="magic-email" className="block text-sm text-ink">
            Email magic link
          </label>
          <input
            id="magic-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-full border border-ink/15 px-4 py-3 text-ink outline-none focus:border-moss"
          />
          <button type="submit" className="w-full rounded-full bg-cream px-4 py-3 text-ink">
            {sent ? "Link caught. Coming in…" : "Send a magic link"}
          </button>
        </form>
        <button type="button" onClick={() => finish("demo")} className="w-full text-sm text-ink-soft underline">
          Peek as a guest explorer
        </button>
      </div>
    </div>
  );
}
