"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { useClientMounted } from "@/lib/state/use-client-mounted";

type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
}

export function PwaInstall() {
  const mounted = useClientMounted();
  const [promptEvent, setPromptEvent] = useState<PromptEvent | null>(null);
  const [justInstalled, setJustInstalled] = useState(false);
  const [busy, setBusy] = useState(false);
  const installed = justInstalled || (mounted && isStandalone());

  useEffect(() => {
    function onPrompt(event: Event) {
      event.preventDefault();
      setPromptEvent(event as PromptEvent);
    }
    function onInstalled() {
      setJustInstalled(true);
      setPromptEvent(null);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!promptEvent) return;
    setBusy(true);
    track("pwa_install_prompted", { source: "button" });
    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
    setBusy(false);
  }

  if (installed) {
    return (
      <p className="rounded-[1.4rem] bg-moss/10 px-5 py-4 text-ink">
        Already installed on this device. Open it from your home screen or app list — same companions as the website.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {promptEvent ? (
        <button
          type="button"
          onClick={() => void install()}
          disabled={busy}
          className="rounded-full bg-ink px-5 py-3 text-paper disabled:opacity-60"
        >
          {busy ? "Opening the install card…" : "Install"}
        </button>
      ) : (
        <p className="text-ink-soft">
          If your browser can install sites as apps, a button will appear here. Otherwise use the short steps below — they
          work on most work computers without asking IT for a download.
        </p>
      )}
      <ol className="space-y-3 text-ink-soft">
        <li>
          <strong className="text-ink">Chrome or Edge (Windows, Mac, Chromebook):</strong> open the menu (three dots) →
          Cast, save, and share → <em>Install page as app</em>. You get a window of this site, not
          a store download.
        </li>
        <li>
          <strong className="text-ink">Safari on iPhone or iPad:</strong> tap Share → Add to Home Screen.{mounted && isIos() ? " You are on iOS — that Share button is at the bottom (or top) of Safari." : ""}
        </li>
        <li>
          <strong className="text-ink">Safari on a Mac:</strong> File → Add to Dock. Your companions stay in the browser; nothing extra is installed from us.
        </li>
        <li>
          <strong className="text-ink">Firefox:</strong> bookmark this page or pin the tab. Firefox does not always offer “Install app.”
        </li>
      </ol>
      <p className="text-sm text-ink-soft">
        Your companions stay right where they are — pinning just gives them their own window.
      </p>
    </div>
  );
}
