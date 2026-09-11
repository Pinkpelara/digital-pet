"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

export type VoiceMode = "adult" | "kid";

const KEY = "companions.voice.v1";
const listeners = new Set<() => void>();

function read(): VoiceMode {
  if (typeof window === "undefined") return "adult";
  try {
    return window.localStorage.getItem(KEY) === "kid" ? "kid" : "adult";
  } catch {
    return "adult";
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setVoiceMode(mode: VoiceMode) {
  try {
    window.localStorage.setItem(KEY, mode);
  } catch {
    /* blocked storage */
  }
  emit();
}

export function useVoiceMode(): { mode: VoiceMode; setMode: (mode: VoiceMode) => void } {
  const mode = useSyncExternalStore(subscribe, read, () => "adult" as const);
  const setMode = useCallback((next: VoiceMode) => setVoiceMode(next), []);
  return useMemo(() => ({ mode, setMode }), [mode, setMode]);
}
