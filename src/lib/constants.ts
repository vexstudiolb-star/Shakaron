export const siteConfig = {
  assets: {
    logo: "/logo.png",
    logoVideo: "/logo-video.mp4",
    heroVideo: "/hero-video.mp4",
  },
  contact: {
    phone: "00961 76 071 922",
    phoneTel: "+96176071922",
    whatsapp: "https://wa.me/96176071922",
  },
  social: [
    { id: "whatsapp" as const, href: "https://wa.me/96176071922" },
    { id: "instagram" as const, href: "https://instagram.com" },
  ],
  navHrefs: {
    collections: "#collections",
    bespoke: "#bespoke",
    atelier: "#atelier",
    contact: "#contact",
  },
} as const;

const img = {
  ring: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80",
  gems: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80",
  necklace: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80",
  craft: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80",
  macro: "https://images.unsplash.com/photo-1463104949047-84930089c29f?auto=format&fit=crop&q=80",
} as const;

export const collectionMeta = [
  { id: "lumiere", aspect: "tall" as const, image: img.ring },
  { id: "velours", aspect: "wide" as const, image: img.gems },
  { id: "aube", aspect: "square" as const, image: img.necklace },
  { id: "eternel", aspect: "tall" as const, image: img.macro },
  { id: "solstice", aspect: "wide" as const, image: img.ring },
  { id: "nocturne", aspect: "square" as const, image: img.gems },
] as const;

export const craftsmanshipImages = [
  img.craft,
  img.gems,
  img.macro,
  img.ring,
] as const;

export const atelierImages = [img.craft, img.gems, img.ring] as const;

export const images = img;
