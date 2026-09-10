import { NextResponse } from "next/server";
import { adminPassword } from "@/lib/demo-mode";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let password = "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? "";
  } else {
    const form = await request.formData();
    password = String(form.get("password") ?? "");
  }
  if (password !== adminPassword()) {
    if (contentType.includes("application/json")) {
      return NextResponse.json({ error: "Locked" }, { status: 401 });
    }
    return new NextResponse(null, { status: 303, headers: { Location: "/admin?error=1" } });
  }

  const isForm = !contentType.includes("application/json");
  const response = isForm
    ? new NextResponse(null, { status: 303, headers: { Location: "/admin" } })
    : NextResponse.json({ ok: true });
  response.cookies.set("companions_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
