import { NextResponse } from "next/server";
import { listInstances, listOwnership } from "@/lib/server/grants";

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get("userId") ?? "demo-user";
  return NextResponse.json({
    ownership: listOwnership(userId),
    instances: listInstances(userId),
  });
}
