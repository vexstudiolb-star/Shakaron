import { NextResponse } from "next/server";
import { getStorefrontCatalog } from "@/lib/collections/cms-catalog";

export const dynamic = "force-dynamic";

/** Public catalog — categories + products from Supabase (images on R2). */
export async function GET() {
  const catalog = await getStorefrontCatalog();
  return NextResponse.json(catalog);
}
