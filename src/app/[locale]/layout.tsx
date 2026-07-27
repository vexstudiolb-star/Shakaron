import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SalesAssistant } from "@/components/assistant/SalesAssistant";
import { HtmlAttributes } from "@/components/layout/HtmlAttributes";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { StorefrontCatalogProvider } from "@/lib/collections/use-storefront-products";
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
    <LocaleProvider key={locale} locale={locale} dict={dict} dir={dir}>
      <StorefrontCatalogProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.lang=${JSON.stringify(locale)};document.documentElement.dir=${JSON.stringify(dir)};`,
          }}
        />
        <HtmlAttributes locale={locale} dir={dir} />
        <a href="#main-content" className="skip-link">
          {dict.common.skipToContent}
        </a>
        <Navbar />
        <main id="main-content" lang={locale} dir={dir}>
          {children}
        </main>
        <Footer />
        <SalesAssistant />
      </StorefrontCatalogProvider>
    </LocaleProvider>
  );
}
