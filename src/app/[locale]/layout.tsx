import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SiteLoader } from "@/components/layout/SiteLoader";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { HtmlAttributes } from "@/components/layout/HtmlAttributes";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { getDirection, isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const dict = getDictionary(localeParam);
  return {
    title: {
      default: `${dict.meta.name} — ${dict.meta.tagline}`,
      template: `%s | ${dict.meta.name}`,
    },
    description: dict.meta.description,
    openGraph: {
      title: dict.meta.name,
      description: dict.meta.description,
      type: "website",
      locale: localeParam === "ar" ? "ar_LB" : "en_US",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const dir = getDirection(locale);

  return (
    <LocaleProvider locale={locale} dict={dict} dir={dir}>
      <HtmlAttributes locale={locale} dir={dir} />
      <a href="#main-content" className="skip-link">
        {dict.common.skipToContent}
      </a>
      <LanguageSwitcher fixed />
      <SiteLoader>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppButton />
      </SiteLoader>
    </LocaleProvider>
  );
}
