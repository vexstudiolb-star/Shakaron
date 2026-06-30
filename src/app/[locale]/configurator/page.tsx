import type { Metadata } from "next";
import { JewelryConfigurator } from "@/components/configurator";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, type Locale } from "@/i18n/config";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const dict = getDictionary(localeParam as Locale);
  return {
    title: dict.configurator.title,
    description: dict.configurator.subtitle,
  };
}

export default function ConfiguratorPage() {
  return <JewelryConfigurator />;
}
