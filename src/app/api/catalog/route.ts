import { NextResponse } from "next/server";
import { getStorefrontProducts } from "@/lib/collections/cms-catalog";

export const dynamic = "force-dynamic";

/** Public catalog for storefront cards — CMS products use Cloudflare R2 image URLs. */
export async function GET() {
  const products = await getStorefrontProducts();
  return NextResponse.json({ products });
}
