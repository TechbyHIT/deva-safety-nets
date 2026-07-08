import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand revalidation endpoint. Call after editing content so cached
 * catalog/location/content queries and sitemaps refresh without a redeploy.
 *
 *   POST /api/revalidate?tag=catalog&secret=YOUR_SECRET
 */
export const runtime = "nodejs";

const VALID_TAGS = new Set(["catalog", "locations", "content"]);

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const tag = searchParams.get("tag");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }
  if (!tag || !VALID_TAGS.has(tag)) {
    return NextResponse.json(
      { ok: false, message: `tag must be one of: ${[...VALID_TAGS].join(", ")}` },
      { status: 400 },
    );
  }

  revalidateTag(tag, "max");
  return NextResponse.json({ ok: true, revalidated: tag, now: Date.now() });
}
