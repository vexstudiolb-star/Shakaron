import type { Locale } from "@/i18n/config";
import { siteConfig } from "@/lib/constants";
import {
  isConfiguratorQuery,
  isContactQuery,
  isGreeting,
  isPricingQuery,
  searchProducts,
  type SearchResult,
} from "./search";

export type AssistantProduct = {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  href: string;
};

export type AssistantReply = {
  message: string;
  products: AssistantProduct[];
  suggestions?: string[];
};

function toAssistantProduct(item: SearchResult): AssistantProduct {
  return {
    id: item.id,
    name: item.fullName,
    category: item.categoryLabel,
    price: item.priceLabel,
    image: item.image,
    href: item.href,
  };
}

const COPY = {
  en: {
    greeting:
      "Welcome to Shakaron. I'm your personal jewellery assistant — tell me what you're looking for, e.g. “a flower pendant” or “kids bracelet”.",
    noResults:
      "I couldn't find an exact match on our site yet. Try a category like rings, necklaces, or kids — or describe the style you want.",
    found: (n: number) =>
      n === 1
        ? "I found this piece for you — tap the image to view it:"
        : `I found ${n} pieces that match — tap any image to go straight to the product:`,
    pricing:
      "All Shakaron pieces are bespoke and priced on request. Tap a piece you like, or message us on WhatsApp for a private consultation.",
    contact: `I'd be happy to connect you with our atelier. Message us on WhatsApp at ${siteConfig.contact.phone} or tap below.`,
    custom:
      "For a custom or bespoke piece, message our atelier on WhatsApp — we'll design it with you privately.",
    empty: "Please describe what you're looking for — style, category, or occasion.",
    suggestions: ["Flower pendant", "Engagement ring", "Kids charm", "Bridal full set"],
  },
  ar: {
    greeting:
      "أهلاً بك في شاكارون. أنا مساعدك الشخصي للمجوهرات — أخبرني بما تبحث عنه، مثل «قلادة وردة» أو «سوار للأطفال».",
    noResults:
      "لم أجد تطابقاً دقيقاً بعد. جرّب فئة مثل خواتم أو قلائد أو أطفال — أو صف الأسلوب الذي تريده.",
    found: (n: number) =>
      n === 1
        ? "وجدت هذه القطعة لك — اضغط على الصورة لعرضها:"
        : `وجدت ${n} قطعاً مناسبة — اضغط على أي صورة للانتقال مباشرة إلى المنتج:`,
    pricing:
      "كل قطع شاكارون حصرية والسعر عند الطلب. اختر قطعة تعجبك أو راسلنا على واتساب لاستشارة خاصة.",
    contact: `يسعدني ربطك بورشتنا. راسلنا على واتساب ${siteConfig.contact.phone}.`,
    custom:
      "للقطع حسب الطلب، راسل ورشتنا على واتساب — نصمّمها معك بشكل خاص.",
    empty: "صف ما تبحث عنه — الأسلوب أو الفئة أو المناسبة.",
    suggestions: ["قلادة وردة", "خاتم خطوبة", "تعليقة أطفال", "طقم عروس"],
  },
} as const;

export function generateAssistantReply(query: string, locale: Locale): AssistantReply {
  const t = COPY[locale];
  const trimmed = query.trim();

  if (!trimmed) {
    return { message: t.empty, products: [], suggestions: [...t.suggestions] };
  }

  if (isGreeting(trimmed)) {
    return { message: t.greeting, products: [], suggestions: [...t.suggestions] };
  }

  if (isPricingQuery(trimmed)) {
    return { message: t.pricing, products: [], suggestions: [...t.suggestions] };
  }

  if (isContactQuery(trimmed)) {
    return { message: t.contact, products: [], suggestions: [...t.suggestions] };
  }

  if (isConfiguratorQuery(trimmed)) {
    return {
      message: t.custom,
      products: [],
      suggestions: locale === "ar" ? ["تواصل واتساب", "خواتم", "قلائد"] : ["WhatsApp", "Rings", "Necklaces"],
    };
  }

  const results = searchProducts(trimmed, locale, 4);

  if (results.length === 0) {
    return { message: t.noResults, products: [], suggestions: [...t.suggestions] };
  }

  return {
    message: t.found(results.length),
    products: results.map(toAssistantProduct),
    suggestions: [...t.suggestions],
  };
}
