import { NextResponse } from "next/server";
import { getInstance, saveInstance } from "@/lib/server/grants";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let id = "";
  let name = "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { id?: string; name?: string };
    id = body.id ?? "";
    name = body.name ?? "";
  } else {
    const form = await request.formData();
    id = String(form.get("id") ?? "");
    name = String(form.get("name") ?? "");
  }
  const instance = getInstance(id);
  if (!instance) return NextResponse.json({ error: "Missing companion" }, { status: 404 });
  const named = saveInstance({ ...instance, name: name.trim() || instance.name });
  if (!contentType.includes("application/json")) {
    return new NextResponse(null, {
      status: 303,
      headers: { Location: `/my-companions/studio?id=${encodeURIComponent(named.id)}` },
    });
  }
  return NextResponse.json({ instance: named });
}
