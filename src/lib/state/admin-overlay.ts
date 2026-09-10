import { items as seedItems } from "@/data/catalog";
import type { CatalogItem } from "@/lib/types";

const OVERLAY_KEY = "sillkin.admin.overlay.v1";
const AUTH_KEY = "sillkin.admin.auth";
export const DEMO_ADMIN_PASSWORD = "sillkin-admin";

export function isAdminUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(AUTH_KEY) === "1";
}

export function unlockAdmin(password: string): boolean {
  if (password !== DEMO_ADMIN_PASSWORD) return false;
  window.sessionStorage.setItem(AUTH_KEY, "1");
  return true;
}

export function readAdminItems(): CatalogItem[] {
  if (typeof window === "undefined") return seedItems;
  try {
    const raw = window.localStorage.getItem(OVERLAY_KEY);
    if (!raw) return seedItems.map((item) => ({ ...item }));
    const overlay = JSON.parse(raw) as CatalogItem[];
    const byId = new Map(overlay.map((item) => [item.id, item]));
    return seedItems.map((item) => byId.get(item.id) ?? { ...item });
  } catch {
    return seedItems.map((item) => ({ ...item }));
  }
}

export function writeAdminItems(next: CatalogItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(OVERLAY_KEY, JSON.stringify(next));
}
