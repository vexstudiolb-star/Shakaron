import { CollectionShowcase } from "@/components/collections/CollectionShowcase";
import { isLocale, locales } from "@/i18n/config";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

export function generateStaticParams() {
  // Categories come from CMS at runtime — keep locale shells only
  return locales.map((locale) => ({ locale, category: "rings" }));
}

export const dynamicParams = true;

export default async function CollectionCategoryPage({ params }: Props) {
  const { locale, category } = await params;

  if (!isLocale(locale) || !category?.trim()) {
    notFound();
  }

  return <CollectionShowcase activeCategory={category} />;
}
