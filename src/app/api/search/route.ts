import { NextResponse } from "next/server";
import { searchSite } from "@/lib/search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").slice(0, 80);
  const results = await searchSite(q, 20);
  return NextResponse.json(
    { query: q, results },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
