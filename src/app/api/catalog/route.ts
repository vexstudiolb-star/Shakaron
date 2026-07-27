import { NextResponse } from "next/server";
import { getStorefrontCatalog } from "@/lib/collections/cms-catalog";

/** Public catalog — short edge cache for faster mobile revisits */
export async function GET() {
  const catalog = await getStorefrontCatalog();
  return NextResponse.json(catalog, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
