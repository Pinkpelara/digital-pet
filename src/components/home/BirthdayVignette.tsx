"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayableStage } from "@/components/stage/PlayableStage";
import { track } from "@/lib/analytics";
import { useClientMounted } from "@/lib/state/use-client-mounted";
import {
  dismissBirthday,
  forceBirthday,
  grantBalloonBunch,
  hasBalloonBunch,
  readPresence,
  shouldShowBirthday,
} from "@/lib/state/presence";

export function BirthdayVignette({ compact = false }: { compact?: boolean }) {
  const mounted = useClientMounted();
  const [open, setOpen] = useState(false);
  const [, setTick] = useState(0);

  if (!mounted) {
    return compact ? <div className="px-5 py-10 text-ink-soft">Checking the post.</div> : null;
  }

  const state = readPresence();
  const force = state.birthdayForce;
  const visible = shouldShowBirthday(state) || compact;

  function openParcel() {
    grantBalloonBunch();
    setOpen(true);
    track("birthday_opened", { compact });
  }

  function hide() {
    dismissBirthday();
    setTick((value) => value + 1);
    setOpen(false);
  }

  function replay() {
    forceBirthday(true);
    setTick((value) => value + 1);
    setOpen(false);
  }

  if (!visible) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-10">
        <button type="button" onClick={replay} className="text-sm text-moss underline underline-offset-4">
          Replay birthday surprise
        </button>
      </div>
    );
  }

  return (
    <section className={`mx-auto max-w-6xl px-5 ${compact ? "py-10" : "py-20"} md:px-10`}>
      <p className="kicker">They notice you</p>
      <h2 className="mt-3 max-w-[16ch] font-display text-4xl leading-[0.92] text-ink md:text-6xl">
        It’s your birthday. They already knew.
      </h2>
      <p className="mt-4 max-w-xl text-ink-soft">
        A parcel shows up without you mentioning it. They sit with you while you work. Ignore them
        long enough and they sulk — lightly, not a streak counter.
      </p>

      <div className="mt-10 grid items-center gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <div className="birthday-stage relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-[1.8rem] bg-cream px-6 py-8 stage-frame">
          {!open ? (
            <button type="button" onClick={openParcel} className="flex flex-col items-center" aria-label="Open the birthday parcel">
              <div className="parcel is-shaking">
                <div className="parcel-box" />
                <div className="parcel-flap" />
              </div>
              <p className="mt-6 text-sm text-ink-soft">A parcel. No note. They still knew.</p>
            </button>
          ) : (
            <>
              <div className="parcel is-open mb-3">
                <div className="parcel-box" />
                <div className="parcel-flap" />
              </div>
              <div className="h-[300px] w-full">
                <PlayableStage
                  species="bloop"
                  equipped={{ head: "gadget-partyhat", back: "gadget-balloon" }}
                  autoPlay="party"
                  playAction="party"
                  companionName="Bloop"
                  hint="Party hat + confetti. Balloon Bunch is free for 24 hours."
                  className="h-full"
                  cameraZ={5.4}
                />
              </div>
            </>
          )}
        </div>

        <div>
          <ul className="space-y-4 text-ink-soft">
            <li>
              <span className="font-medium text-ink">Work-with-you.</span> They live in the corner
              while you study or take calls — presence, not a productivity coach.
            </li>
            <li>
              <span className="font-medium text-ink">Sulk when ignored.</span> Look away long enough
              and they turn their back. Tap them. They come back.
            </li>
            <li>
              <span className="font-medium text-ink">They’re still them.</span> Two Bloops, two
              problems.
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/browser" className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
              Keep them in the corner
            </Link>
            <button
              type="button"
              onClick={force ? hide : replay}
              className="rounded-full border border-ink/15 px-6 py-3 text-sm text-ink"
            >
              {force ? "That’s enough cake" : "It’s my birthday (demo)"}
            </button>
          </div>
          {open || hasBalloonBunch() ? (
            <p className="mt-4 text-sm text-moss">
              Balloon Bunch is a free 24-hour Teach — we sell the{" "}
              <Link href="/item/party-hat" className="underline underline-offset-4">
                Party Hat
              </Link>
              , not the cake.{" "}
              <Link href="/item/balloon-bunch" className="underline underline-offset-4">
                See the Teach
              </Link>
              .
            </p>
          ) : null}
          <p className="mt-4 text-xs text-ink-soft">
            Demo uses a local birthday flag. Nothing is sent anywhere. No wellness scores.
          </p>
        </div>
      </div>
    </section>
  );
}
