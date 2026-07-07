export const COLLECTION_CATEGORIES = [
  "rings",
  "bracelets",
  "necklaces",
  "full-set",
  "kids",
] as const;

export type CollectionCategory = (typeof COLLECTION_CATEGORIES)[number];

export function isCollectionCategory(value: string): value is CollectionCategory {
  return (COLLECTION_CATEGORIES as readonly string[]).includes(value);
}

const photos = {
  ring1: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
  ring2: "https://images.unsplash.com/photo-1463104949047-84930089c29f?auto=format&fit=crop&q=80&w=800",
  ring3: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
  bracelet1: "https://images.unsplash.com/photo-1611591437281-460bfbead0f3?auto=format&fit=crop&q=80&w=800",
  bracelet2: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
  necklace1: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
  necklace2: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800",
  set1: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80&w=800",
  set2: "https://images.unsplash.com/photo-1617038260897-41a1a14a8a00?auto=format&fit=crop&q=80&w=800",
  kids1: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80&w=800",
  kids2: "https://images.unsplash.com/photo-1603561596111-0a1df9d16a9e?auto=format&fit=crop&q=80&w=800",
} as const;

export type CollectionProduct = {
  id: string;
  category: CollectionCategory;
  images: readonly string[];
};

export const COLLECTION_PRODUCTS: readonly CollectionProduct[] = [
  { id: "aurora-solitaire", category: "rings", images: [photos.ring1, photos.ring2, photos.ring3] },
  { id: "lumiere-band", category: "rings", images: [photos.ring2, photos.ring1] },
  { id: "eternal-promise", category: "rings", images: [photos.ring3, photos.ring2] },
  { id: "golden-cuff", category: "bracelets", images: [photos.bracelet1, photos.bracelet2] },
  { id: "riviere-chain", category: "bracelets", images: [photos.bracelet2, photos.bracelet1] },
  { id: "atelier-bangle", category: "bracelets", images: [photos.bracelet1, photos.ring1] },
  { id: "aube-pendant", category: "necklaces", images: [photos.necklace1, photos.necklace2] },
  { id: "solstice-choker", category: "necklaces", images: [photos.necklace2, photos.necklace1] },
  { id: "nocturne-lariat", category: "necklaces", images: [photos.necklace1, photos.ring3] },
  { id: "maison-trio", category: "full-set", images: [photos.set1, photos.set2, photos.ring1] },
  { id: "heritage-suite", category: "full-set", images: [photos.set2, photos.necklace1, photos.bracelet1] },
  { id: "bridal-parure", category: "full-set", images: [photos.set1, photos.necklace2] },
  { id: "petite-charm", category: "kids", images: [photos.kids1, photos.kids2] },
  { id: "little-star", category: "kids", images: [photos.kids2, photos.kids1] },
  { id: "mini-heart", category: "kids", images: [photos.kids1, photos.ring1] },
] as const;

export function productsForCategory(category: CollectionCategory) {
  return COLLECTION_PRODUCTS.filter((product) => product.category === category);
}

export const CATEGORY_HERO_IMAGES: Record<CollectionCategory, string> = {
  rings: photos.ring1,
  bracelets: photos.bracelet1,
  necklaces: photos.necklace1,
  "full-set": photos.set1,
  kids: photos.kids1,
};
