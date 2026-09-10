import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { archiveItem, getItems, upsertItem } from "@/lib/server/catalog";
import type { CatalogItem } from "@/lib/types";

async function requireAdmin() {
  const jar = await cookies();
  return jar.get("companions_admin")?.value === "1";
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ items: getItems() });
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as Partial<CatalogItem> & { id?: string };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const item = upsertItem({ ...body, id: body.id });
  return NextResponse.json({ item });
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const item = archiveItem(id);
  return NextResponse.json({ item });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as Partial<CatalogItem>;
  const item = upsertItem({
    ...body,
    id: body.id ?? crypto.randomUUID(),
    sku: body.sku ?? `custom-${Date.now()}`,
    slug: body.slug ?? `item-${Date.now()}`,
    kind: body.kind ?? "outfit",
    name: body.name ?? "New item",
    tagline: body.tagline ?? "",
    description: body.description ?? "",
    priceCents: body.priceCents ?? 199,
    currency: "usd",
    looksGoodWith: body.looksGoodWith ?? [],
    accent: body.accent ?? "#3DB8B0",
    active: body.active ?? true,
  });
  return NextResponse.json({ item });
}
