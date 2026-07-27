import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/server";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200";

export type StorefrontCategory = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  heroImageUrl: string | null;
  sortOrder: number;
};

export type StorefrontProduct = {
  id: string;
  category: string;
  images: readonly string[];
  wornImage: string;
  line1En: string;
  line1Ar: string;
  line2En: string;
  line2Ar: string;
  priceEn: string;
  priceAr: string;
  source: "cms";
};

type CmsCategoryRow = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  hero_image_url: string | null;
  sort_order: number;
};

type CmsProductRow = {
  slug: string;
  category_id: string;
  brand_line_en: string;
  brand_line_ar: string;
  name_en: string;
  name_ar: string;
  price_label_en: string;
  price_label_ar: string;
  product_image_url: string | null;
  worn_image_url: string | null;
};

function createPublicCatalogClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getStorefrontCatalog(): Promise<{
  categories: StorefrontCategory[];
  products: StorefrontProduct[];
  fromCms: boolean;
}> {
  if (!isSupabaseConfigured()) {
    return { categories: [], products: [], fromCms: false };
  }

  const supabase = createPublicCatalogClient();
  if (!supabase) {
    return { categories: [], products: [], fromCms: false };
  }

  try {
    const [catRes, prodRes] = await Promise.all([
      supabase
        .from("collection_categories")
        .select(
          "id, slug, name_en, name_ar, description_en, description_ar, hero_image_url, sort_order"
        )
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("products")
        .select(
          "slug, category_id, brand_line_en, brand_line_ar, name_en, name_ar, price_label_en, price_label_ar, product_image_url, worn_image_url"
        )
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

    if (catRes.error || prodRes.error) {
      console.error("[catalog]", catRes.error?.message, prodRes.error?.message);
      return { categories: [], products: [], fromCms: false };
    }

    const categories: StorefrontCategory[] = (catRes.data as CmsCategoryRow[] | null)?.map(
      (c) => ({
        id: c.id,
        slug: c.slug,
        nameEn: c.name_en,
        nameAr: c.name_ar,
        descriptionEn: c.description_en ?? "",
        descriptionAr: c.description_ar ?? "",
        heroImageUrl: c.hero_image_url,
        sortOrder: c.sort_order,
      })
    ) ?? [];

    const slugByCategoryId = new Map(categories.map((c) => [c.id, c.slug]));

    const products: StorefrontProduct[] = [];
    for (const row of (prodRes.data as CmsProductRow[] | null) ?? []) {
      const category = slugByCategoryId.get(row.category_id);
      if (!category) continue;

      const productImage =
        row.product_image_url?.trim() || row.worn_image_url?.trim() || PLACEHOLDER_IMAGE;
      const worn = row.worn_image_url?.trim() || productImage;

      products.push({
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

    return { categories, products, fromCms: true };
  } catch (err) {
    console.error("[catalog]", err);
    return { categories: [], products: [], fromCms: false };
  }
}

/** @deprecated use getStorefrontCatalog */
export async function getStorefrontProducts() {
  const { products } = await getStorefrontCatalog();
  return products;
}
