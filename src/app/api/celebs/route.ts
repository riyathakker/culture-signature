import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// Lightly cache the Cloudinary listing so we don't hit the Admin API (which is
// rate-limited) on every homepage load. Short TTL so newly uploaded celebs
// appear quickly.
const CACHE_TTL_MS = 60 * 1000;
let cache: { urls: string[]; at: number } | null = null;

const byNewest = (a: any, b: any) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return NextResponse.json({ images: cache.urls, cached: true });
  }

  try {
    // Classic folders: public_ids are prefixed "celebs/".
    const byPrefix = await cloudinary.api.resources({
      type: "upload",
      prefix: "celebs/",
      max_results: 100,
    });

    let resources: any[] = byPrefix.resources ?? [];

    // Dynamic-folders accounts store the folder separately (public_id has no
    // prefix) — fall back to the Search API by asset folder.
    if (resources.length === 0) {
      try {
        const search = await cloudinary.search
          .expression('folder="celebs" OR asset_folder="celebs"')
          .max_results(100)
          .execute();
        resources = search.resources ?? [];
      } catch (searchErr) {
        console.error("[CELEBS_GET] search fallback failed", searchErr);
      }
    }

    const urls = resources.sort(byNewest).map((r) => r.secure_url as string);

    cache = { urls, at: Date.now() };
    return NextResponse.json({ images: urls });
  } catch (error) {
    console.error("[CELEBS_GET]", error);
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}
