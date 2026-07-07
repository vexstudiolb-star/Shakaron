import { notFound } from "next/navigation";
import { CollectionShowcase } from "@/components/collections/CollectionShowcase";
import {
  COLLECTION_CATEGORIES,
  isCollectionCategory,
} from "@/lib/collections/catalog";
import { isLocale, locales } from "@/i18n/config";

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    COLLECTION_CATEGORIES.map((category) => ({ locale, category }))
  );
}

export default async function CollectionCategoryPage({ params }: Props) {
  const { locale, category } = await params;

  if (!isLocale(locale) || !isCollectionCategory(category)) {
    notFound();
  }

  return <CollectionShowcase activeCategory={category} />;
}
