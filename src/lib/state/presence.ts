const KEY = "companions.presence.v1";

export type PresenceState = {
  lastInteractAt: number;
  /** Demo toggle: replay the birthday parcel. */
  birthdayForce: boolean;
  birthdaySeenAt: string | null;
  /** Seeded once so the demo surprise can fire without a real birth date. */
  seededBirthday: boolean;
};

const DEFAULT: PresenceState = {
  lastInteractAt: 0,
  birthdayForce: false,
  birthdaySeenAt: null,
  seededBirthday: false,
};

function read(): PresenceState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...(JSON.parse(raw) as Partial<PresenceState>) };
  } catch {
    return { ...DEFAULT };
  }
}

function write(next: PresenceState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function readPresence(): PresenceState {
  return read();
}

export function markPresenceInteract(): PresenceState {
  const next = { ...read(), lastInteractAt: Date.now() };
  write(next);
  return next;
}

export function idleMs(state: PresenceState = read()): number {
  if (!state.lastInteractAt) return 0;
  return Date.now() - state.lastInteractAt;
}

/**
 * Show the birthday parcel when:
 * - the demo toggle is on, or
 * - this browser has never seen it (seeded surprise on first visit).
 */
export function shouldShowBirthday(state: PresenceState = read()): boolean {
  if (state.birthdayForce) return true;
  return !state.birthdaySeenAt;
}

export function dismissBirthday(): PresenceState {
  const next = { ...read(), birthdayForce: false, birthdaySeenAt: new Date().toISOString(), seededBirthday: true };
  write(next);
  return next;
}

export function forceBirthday(on = true): PresenceState {
  const next = { ...read(), birthdayForce: on, birthdaySeenAt: on ? null : read().birthdaySeenAt };
  write(next);
  return next;
}
