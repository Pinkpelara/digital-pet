import { createHmac, timingSafeEqual } from "node:crypto";
import { demoGrantSecret } from "@/lib/demo-mode";

export type GrantTokenPayload = {
  userId: string;
  itemIds: string[];
  nonce: string;
  exp: number;
};

function sign(value: string): string {
  return createHmac("sha256", demoGrantSecret()).update(value).digest("base64url");
}

export function createGrantToken(payload: Omit<GrantTokenPayload, "exp" | "nonce"> & { nonce?: string }): string {
  const body: GrantTokenPayload = {
    userId: payload.userId,
    itemIds: payload.itemIds,
    nonce: payload.nonce ?? crypto.randomUUID(),
    exp: Date.now() + 1000 * 60 * 30,
  };
  const encoded = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function readGrantToken(token: string): GrantTokenPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as GrantTokenPayload;
    if (payload.exp < Date.now()) return null;
    if (!payload.userId || !Array.isArray(payload.itemIds)) return null;
    return payload;
  } catch {
    return null;
  }
}
