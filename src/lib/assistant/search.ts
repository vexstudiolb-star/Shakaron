import type { Locale } from "@/i18n/config";
import {
  buildProductKnowledge,
  CATEGORY_ALIASES,
  THEME_ALIASES,
  type ProductKnowledge,
} from "./product-knowledge";

export type SearchResult = ProductKnowledge & { score: number };

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function expandTokens(tokens: string[]): Set<string> {
  const expanded = new Set(tokens);

  for (const token of tokens) {
    if (CATEGORY_ALIASES[token]) expanded.add(CATEGORY_ALIASES[token]);
    for (const [theme, aliases] of Object.entries(THEME_ALIASES)) {
      if (aliases.some((a) => a.includes(token) || token.includes(a))) {
        expanded.add(theme);
        aliases.forEach((a) => expanded.add(a));
      }
    }
  }

  return expanded;
}

function scoreProduct(product: ProductKnowledge, tokens: Set<string>, rawQuery: string): number {
  let score = 0;
  const haystack = [
    product.id,
    product.fullName,
    product.line2,
    product.category,
    product.categoryLabel,
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase();

  for (const token of tokens) {
    if (haystack.includes(token)) score += 3;
    if (product.tags.some((tag) => tag.includes(token) || token.includes(tag))) score += 4;
    if (product.line2.toLowerCase().includes(token)) score += 5;
    if (product.category === token) score += 6;
  }

  if (rawQuery.includes(product.id.replace(/-/g, " "))) score += 8;

  return score;
}

export function searchProducts(query: string, locale: Locale, limit = 4): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const tokens = expandTokens(tokenize(trimmed));
  const catalog = buildProductKnowledge(locale);
  const raw = trimmed.toLowerCase();

  return catalog
    .map((product) => ({
      ...product,
      score: scoreProduct(product, tokens, raw),
    }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function isGreeting(query: string): boolean {
  return /^(hi|hello|hey|salam|marhaba|مرحبا|اهلا|السلام|good\s*(morning|evening|afternoon))/i.test(
    query.trim()
  );
}

export function isPricingQuery(query: string): boolean {
  return /(price|cost|how much|pricing|سعر|كم|تكلفة)/i.test(query);
}

export function isContactQuery(query: string): boolean {
  return /(contact|whatsapp|phone|call|appointment|book|تواصل|واتساب|موعد|اتصل)/i.test(query);
}

export function isConfiguratorQuery(query: string): boolean {
  return /(custom|bespoke|design|configurator|configure|build|حسب الطلب|تصميم|تخصيص)/i.test(query);
}
