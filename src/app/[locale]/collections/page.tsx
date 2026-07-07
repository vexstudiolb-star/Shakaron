import { redirect } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function CollectionsIndexPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) redirect("/en/collections/rings");
  redirect(`/${locale}/collections/rings`);
}
