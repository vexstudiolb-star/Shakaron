import { redirect } from "next/navigation";
import { getStorefrontCatalog } from "@/lib/collections/cms-catalog";
import { isLocale, locales } from "@/i18n/config";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function CollectionsIndexPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) redirect("/en/collections");

  const { categories } = await getStorefrontCatalog();
  const first = categories[0]?.slug ?? "rings";
  redirect(`/${locale}/collections/${first}`);
}
