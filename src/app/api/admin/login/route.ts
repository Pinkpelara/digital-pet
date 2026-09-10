import { NextResponse } from "next/server";
import { adminPassword } from "@/lib/demo-mode";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  if (body.password !== adminPassword()) {
    return NextResponse.json({ error: "Locked" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("sillkin_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
