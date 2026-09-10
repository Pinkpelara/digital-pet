import { brand } from "@/lib/brand";

export function companionsUrl(path: string): string {
  const clean = path.replace(/^\//, "");
  return `${brand.deepLinkScheme}://${clean}`;
}

export function bringToDesktopUrl(instanceId: string): string {
  return companionsUrl(`adopt/${instanceId}`);
}

export function openDesktopHome(): string {
  return companionsUrl("home");
}
