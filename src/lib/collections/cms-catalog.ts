import { createClient } from "@supabase/supabase-js";
import {
  COLLECTION_PRODUCTS,
  isCollectionCategory,
  type CollectionCategory,
  type CollectionProduct,
} from "@/lib/collections/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export type StorefrontProduct = CollectionProduct & {
  line1En: string;
  line1Ar: string;
  line2En: string;
  line2Ar: string;
  priceEn: string;
  priceAr: string;
  source: "cms" | "static";
};

type CmsProductRow = {
  slug: string;
  brand_line_en: string;
  brand_line_ar: string;
  name_en: string;
  name_ar: string;
  price_label_en: string;
  price_label_ar: string;
  product_image_url: string | null;
  worn_image_url: string | null;
  is_active: boolean;
  collection_categories: { slug: string } | { slug: string }[] | null;
};

function categorySlugFromJoin(
  join: CmsProductRow["collection_categories"]
): string | null {
  if (!join) return null;
  if (Array.isArray(join)) return join[0]?.slug ?? null;
  return join.slug ?? null;
}

function createPublicCatalogClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Active CMS products with R2 image URLs. Falls back to static catalog when empty/unavailable. */
export async function getStorefrontProducts(): Promise<StorefrontProduct[]> {
  if (!isSupabaseConfigured()) {
    return staticAsStorefront();
  }

  try {
    const supabase = createPublicCatalogClient();
    if (!supabase) return staticAsStorefront();

    const { data, error } = await supabase
      .from("products")
      .select(
        "slug, brand_line_en, brand_line_ar, name_en, name_ar, price_label_en, price_label_ar, product_image_url, worn_image_url, is_active, collection_categories(slug)"
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      return staticAsStorefront();
    }

    const cmsProducts: StorefrontProduct[] = [];
    for (const row of data as CmsProductRow[]) {
      const category = categorySlugFromJoin(row.collection_categories);
      if (!category || !isCollectionCategory(category)) continue;
      const productImage = row.product_image_url?.trim();
      if (!productImage) continue;
      const worn = row.worn_image_url?.trim() || productImage;

      cmsProducts.push({
        id: row.slug,
        category,
        images: [productImage],
        wornImage: worn,
        line1En: row.brand_line_en,
        line1Ar: row.brand_line_ar,
        line2En: row.name_en,
        line2Ar: row.name_ar,
        priceEn: row.price_label_en,
        priceAr: row.price_label_ar,
        source: "cms",
      });
    }

    return cmsProducts.length > 0 ? cmsProducts : staticAsStorefront();
  } catch {
    return staticAsStorefront();
  }
}

export function productsForCategoryFromList(
  products: StorefrontProduct[],
  category: CollectionCategory
) {
  return products.filter((p) => p.category === category);
}

function staticAsStorefront(): StorefrontProduct[] {
  return COLLECTION_PRODUCTS.map((p) => ({
    ...p,
    line1En: "Shakaron",
    line1Ar: "شاكارون",
    line2En: p.id,
    line2Ar: p.id,
    priceEn: "Price on request",
    priceAr: "السعر عند الطلب",
    source: "static" as const,
  }));
}
