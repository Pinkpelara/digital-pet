"use client";

import { useVoiceMode } from "@/lib/state/voice";

export function VoiceToggle({ className = "" }: { className?: string }) {
  const { mode, setMode } = useVoiceMode();
  return (
    <button
      type="button"
      className={`text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline ${className}`}
      onClick={() => setMode(mode === "adult" ? "kid" : "adult")}
      aria-pressed={mode === "kid"}
    >
      {mode === "kid" ? "Kid-friendly words on" : "Kid-friendly words"}
    </button>
  );
}
