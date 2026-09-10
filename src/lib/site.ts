/** Public URL prefix. On GitHub Pages this is `/digital-pet`. */
export function publicBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

export function withBasePath(path: string): string {
  const base = publicBasePath();
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}
