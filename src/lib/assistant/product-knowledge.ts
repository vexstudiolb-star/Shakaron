import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import {
  COLLECTION_PRODUCTS,
  type CollectionCategory,
  type CollectionProduct,
} from "@/lib/collections/catalog";
import { localeProductHref } from "@/lib/constants";

/** Search tags & synonyms per product — extend as inventory grows. */
export const PRODUCT_TAGS: Record<string, readonly string[]> = {
  "aurora-solitaire": ["ring", "rings", "solitaire", "diamond", "engagement", "bridal", "gold"],
  "lumiere-band": ["ring", "rings", "band", "wedding", "gold", "minimal"],
  "eternal-promise": ["ring", "rings", "engagement", "promise", "diamond", "bridal"],
  "golden-cuff": ["bracelet", "bracelets", "cuff", "bangle", "gold", "statement"],
  "riviere-chain": ["bracelet", "bracelets", "chain", "diamond", "evening"],
  "atelier-bangle": ["bracelet", "bracelets", "bangle", "gold", "handmade"],
  "aube-pendant": ["necklace", "necklaces", "pendant", "flower", "floral", "rose", "dawn", "gold"],
  "solstice-choker": ["necklace", "necklaces", "choker", "evening", "gold"],
  "nocturne-lariat": ["necklace", "necklaces", "lariat", "statement", "evening"],
  "maison-trio": ["full set", "full-set", "parure", "bridal", "wedding", "suite"],
  "heritage-suite": ["full set", "full-set", "heritage", "bridal", "suite", "gold"],
  "bridal-parure": ["full set", "full-set", "bridal", "wedding", "parure"],
  "petite-charm": ["kids", "child", "children", "charm", "flower", "delicate", "pendant"],
  "little-star": ["kids", "child", "children", "star", "charm", "pendant"],
  "mini-heart": ["kids", "child", "children", "heart", "love", "charm", "pendant"],
  "feather-ring": ["under 1 gram", "under-1-gram", "light", "lightweight", "ring", "delicate", "gold", "everyday"],
  "whisper-band": ["under 1 gram", "under-1-gram", "light", "lightweight", "ring", "band", "minimal", "gold"],
  "petal-pendant": ["under 1 gram", "under-1-gram", "light", "lightweight", "necklace", "pendant", "flower", "delicate"],
  "thread-chain": ["under 1 gram", "under-1-gram", "light", "lightweight", "necklace", "chain", "thin", "gold"],
  "dewdrop-studs": ["under 1 gram", "under-1-gram", "light", "lightweight", "earrings", "studs", "delicate"],
  "gossamer-anklet": ["under 1 gram", "under-1-gram", "light", "lightweight", "anklet", "chain", "delicate"],
};

const CATEGORY_ALIASES: Record<string, CollectionCategory> = {
  ring: "rings",
  rings: "rings",
  solitaire: "rings",
  engagement: "rings",
  bracelet: "bracelets",
  bracelets: "bracelets",
  bangle: "bracelets",
  cuff: "bracelets",
  necklace: "necklaces",
  necklaces: "necklaces",
  pendant: "necklaces",
  choker: "necklaces",
  lariat: "necklaces",
  "full set": "full-set",
  "full-set": "full-set",
  parure: "full-set",
  bridal: "full-set",
  set: "full-set",
  kids: "kids",
  kid: "kids",
  child: "kids",
  children: "kids",
  light: "under-1-gram",
  lightweight: "under-1-gram",
  "under 1 gram": "under-1-gram",
  "under-1-gram": "under-1-gram",
  gram: "under-1-gram",
  anklet: "under-1-gram",
  studs: "under-1-gram",
  earrings: "under-1-gram",
};

const THEME_ALIASES: Record<string, readonly string[]> = {
  flower: ["flower", "floral", "rose", "bloom", "petal", "aube"],
  heart: ["heart", "love", "mini-heart"],
  star: ["star", "little-star"],
  diamond: ["diamond", "solitaire", "aurora", "riviere"],
  gold: ["gold", "golden", "yellow"],
  bridal: ["bridal", "wedding", "engagement", "parure", "promise"],
};

export type ProductKnowledge = {
  id: string;
  category: CollectionCategory;
  line1: string;
  line2: string;
  fullName: string;
  categoryLabel: string;
  priceLabel: string;
  image: string;
  images: readonly string[];
  tags: readonly string[];
  href: string;
};

export function buildProductKnowledge(locale: Locale): ProductKnowledge[] {
  const dict = getDictionary(locale);
  const t = dict.newCollection;

  return COLLECTION_PRODUCTS.map((product) => {
    const copy = t.products[product.id as keyof typeof t.products];
    const tags = PRODUCT_TAGS[product.id] ?? [product.category];

    return {
      id: product.id,
      category: product.category,
      line1: copy.line1,
      line2: copy.line2,
      fullName: `${copy.line1} ${copy.line2}`,
      categoryLabel: t.categories[product.category],
      priceLabel: t.priceOnRequest,
      image: product.images[0],
      images: product.images,
      tags,
      href: localeProductHref(locale, product.category, product.id),
    };
  });
}

export function getProductKnowledge(
  locale: Locale,
  productId: string
): ProductKnowledge | undefined {
  return buildProductKnowledge(locale).find((p) => p.id === productId);
}

export function getProductRecord(productId: string): CollectionProduct | undefined {
  return COLLECTION_PRODUCTS.find((p) => p.id === productId);
}

export { CATEGORY_ALIASES, THEME_ALIASES };
