export const COLLECTION_CATEGORIES = [
  "rings",
  "bracelets",
  "necklaces",
  "full-set",
  "kids",
  "under-1-gram",
] as const;

export type CollectionCategory = (typeof COLLECTION_CATEGORIES)[number];

export function isCollectionCategory(value: string): value is CollectionCategory {
  return (COLLECTION_CATEGORIES as readonly string[]).includes(value);
}

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=800`;

/** Studio / product-only shots (gem icon side of the card switch). */
const item = {
  ringSolitaire: u("photo-1605100804763-247f67b3557e"),
  ringBand: u("photo-1620656798579-1984d9e87df7"),
  ringPromise: u("photo-1630019852942-f89202989a59"),
  braceletCuff: u("photo-1535632066927-ab7c9ab60908"),
  braceletChain: u("photo-1602751584552-8ba73aad10e1"),
  braceletBangle: u("photo-1589674781759-c21c37956a44"),
  necklacePendant: u("photo-1599643478518-a784e5dc4c8f"),
  necklaceChoker: u("photo-1573408301185-9146fe634ad0"),
  necklaceLariat: u("photo-1599643477877-530eb83abc8e"),
  setMaison: u("photo-1506630448388-4e683c67ddb0"),
  setHeritage: u("photo-1458538977777-0549b2370168"),
  setBridal: u("photo-1602173574767-37ac01994b2a"),
  kidsCharm: u("photo-1611085583191-a3b181a88401"),
  kidsStar: u("photo-1611955167811-4711904bb9f8"),
  kidsHeart: u("photo-1603561591411-07134e71a2a9"),
  lightRing: u("photo-1605100804763-247f67b3557e"),
  lightBand: u("photo-1620656798579-1984d9e87df7"),
  lightPendant: u("photo-1599643477877-530eb83abc8e"),
  lightChain: u("photo-1573408301185-9146fe634ad0"),
  lightStuds: u("photo-1630019852942-f89202989a59"),
  lightAnklet: u("photo-1535632066927-ab7c9ab60908"),
} as const;

/** Model wearing the piece (person icon side of the card switch). */
const worn = {
  ringOnHand: u("photo-1601121141461-9d6647bca1ed"),
  ringsStacked: u("photo-1481980235850-66e47651e431"),
  braceletOnWrist: u("photo-1619893454156-26a705ac9eb5"),
  braceletGold: u("photo-1618522755367-bcbb050438b6"),
  necklaceOnNeck: u("photo-1588444650733-d0767b753fc8"),
  necklacePortrait: u("photo-1531995811006-35cb42e1a022"),
  earringsNecklace: u("photo-1694062045776-f48d9b6de57e"),
  fullLook: u("photo-1611652022419-a9419f74343d"),
  softPortrait: u("photo-1515377905703-c4788e51af15"),
} as const;

export type CollectionProduct = {
  id: string;
  category: CollectionCategory;
  /** Product / item photo(s). First image is shown on the card (gem side). */
  images: readonly string[];
  /** Model wearing the piece — shown when the card switch is toggled. */
  wornImage: string;
};

export const COLLECTION_PRODUCTS: readonly CollectionProduct[] = [
  // Rings — item + worn
  { id: "aurora-solitaire", category: "rings", images: [item.ringSolitaire], wornImage: worn.ringOnHand },
  { id: "lumiere-band", category: "rings", images: [item.ringBand], wornImage: worn.ringsStacked },
  { id: "eternal-promise", category: "rings", images: [item.ringPromise], wornImage: worn.ringOnHand },

  // Bracelets
  { id: "golden-cuff", category: "bracelets", images: [item.braceletCuff], wornImage: worn.braceletOnWrist },
  { id: "riviere-chain", category: "bracelets", images: [item.braceletChain], wornImage: worn.braceletGold },
  { id: "atelier-bangle", category: "bracelets", images: [item.braceletBangle], wornImage: worn.braceletOnWrist },

  // Necklaces
  { id: "aube-pendant", category: "necklaces", images: [item.necklacePendant], wornImage: worn.necklaceOnNeck },
  { id: "solstice-choker", category: "necklaces", images: [item.necklaceChoker], wornImage: worn.necklacePortrait },
  { id: "nocturne-lariat", category: "necklaces", images: [item.necklaceLariat], wornImage: worn.earringsNecklace },

  // Full sets
  { id: "maison-trio", category: "full-set", images: [item.setMaison], wornImage: worn.fullLook },
  { id: "heritage-suite", category: "full-set", images: [item.setHeritage], wornImage: worn.earringsNecklace },
  { id: "bridal-parure", category: "full-set", images: [item.setBridal], wornImage: worn.softPortrait },

  // Kids
  { id: "petite-charm", category: "kids", images: [item.kidsCharm], wornImage: worn.necklacePortrait },
  { id: "little-star", category: "kids", images: [item.kidsStar], wornImage: worn.necklaceOnNeck },
  { id: "mini-heart", category: "kids", images: [item.kidsHeart], wornImage: worn.softPortrait },

  // Under 1 gram
  { id: "feather-ring", category: "under-1-gram", images: [item.lightRing], wornImage: worn.ringOnHand },
  { id: "whisper-band", category: "under-1-gram", images: [item.lightBand], wornImage: worn.ringsStacked },
  { id: "petal-pendant", category: "under-1-gram", images: [item.lightPendant], wornImage: worn.necklaceOnNeck },
  { id: "thread-chain", category: "under-1-gram", images: [item.lightChain], wornImage: worn.necklacePortrait },
  { id: "dewdrop-studs", category: "under-1-gram", images: [item.lightStuds], wornImage: worn.earringsNecklace },
  { id: "gossamer-anklet", category: "under-1-gram", images: [item.lightAnklet], wornImage: worn.braceletGold },
] as const;

export function productsForCategory(category: CollectionCategory) {
  return COLLECTION_PRODUCTS.filter((product) => product.category === category);
}

export const CATEGORY_HERO_IMAGES: Record<CollectionCategory, string> = {
  rings: item.ringSolitaire,
  bracelets: item.braceletCuff,
  necklaces: item.necklacePendant,
  "full-set": item.setMaison,
  kids: item.kidsCharm,
  "under-1-gram": item.lightPendant,
};
