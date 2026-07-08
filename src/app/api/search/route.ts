import { NextResponse } from "next/server";
import { searchSite } from "@/lib/search";

export const runtime = "nodejs";
// Cache identical queries at the edge/CDN for snappy instant search.
export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").slice(0, 80);
  const results = await searchSite(q, 20);
  return NextResponse.json(
    { query: q, results },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
