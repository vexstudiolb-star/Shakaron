export type CollectionCategoryRow = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  hero_image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductRow = {
  id: string;
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
  tags: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type HomepageSectionRow = {
  id: string;
  slug: string;
  section_type: string;
  title_en: string;
  title_ar: string;
  eyebrow_en: string;
  eyebrow_ar: string;
  description_en: string;
  description_ar: string;
  is_enabled: boolean;
  sort_order: number;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type MediaAssetRow = {
  id: string;
  file_name: string;
  url: string;
  r2_key: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt_en: string;
  alt_ar: string;
  created_at: string;
};
