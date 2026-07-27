import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { getProductKnowledge } from "@/lib/assistant/product-knowledge";
import { getStorefrontCatalog } from "@/lib/collections/cms-catalog";
import { localeCollectionHref, siteConfig } from "@/lib/constants";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = {
  params: Promise<{ locale: string; category: string; productId: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
    category: "rings",
    productId: "placeholder",
  }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props) {
  const { locale: localeParam, productId } = await params;
  if (!isLocale(localeParam)) return {};

  const catalog = await getStorefrontCatalog();
  const cms = catalog.products.find((p) => p.id === productId);
  if (cms) {
    const name = localeParam === "ar" ? cms.line2Ar : cms.line2En;
    return { title: name };
  }

  const product = getProductKnowledge(localeParam, productId);
  if (!product) return {};
  return {
    title: product.fullName,
    description: `${product.fullName} — ${product.categoryLabel}`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale: localeParam, category, productId } = await params;

  if (!isLocale(localeParam) || !category || !productId) notFound();

  const dict = getDictionary(localeParam);
  const t = dict.newCollection;
  const catalog = await getStorefrontCatalog();
  const cms = catalog.products.find((p) => p.id === productId && p.category === category);

  if (cms) {
    const line1 = localeParam === "ar" ? cms.line1Ar : cms.line1En;
    const line2 = localeParam === "ar" ? cms.line2Ar : cms.line2En;
    const price = localeParam === "ar" ? cms.priceAr : cms.priceEn;
    const cat = catalog.categories.find((c) => c.slug === category);
    const categoryLabel =
      cat == null
        ? category
        : localeParam === "ar"
          ? cat.nameAr
          : cat.nameEn;

    return (
      <section className="bg-charcoal px-6 pb-24 pt-28 text-cream md:pb-32 md:pt-36 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href={localeCollectionHref(localeParam, category)}
            className="mb-8 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-cream/50 transition-colors hover:text-gold"
          >
            <ArrowLeft size={14} strokeWidth={1} />
            {categoryLabel}
          </Link>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-cream/10 bg-charcoal-soft">
              <Image
                src={cms.images[0]}
                alt={line2}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col justify-center">
              <p className="mb-2 text-[0.6rem] uppercase tracking-[0.25em] text-gold-muted">
                {categoryLabel}
              </p>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream/40">
                {line1}
              </p>
              <h1 className="font-serif text-4xl font-light tracking-tight text-ivory md:text-5xl">
                {line2}
              </h1>
              <p className="mt-4 text-lg font-light text-cream/60">{price}</p>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-charcoal transition-colors hover:bg-gold-light"
                >
                  <MessageCircle size={15} />
                  {t.inquire}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Legacy static catalog fallback
  const product = getProductKnowledge(localeParam, productId);
  if (!product || product.category !== category) notFound();

  return (
    <section className="bg-charcoal px-6 pb-24 pt-28 text-cream md:pb-32 md:pt-36 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href={localeCollectionHref(localeParam, category)}
          className="mb-8 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-cream/50 transition-colors hover:text-gold"
        >
          <ArrowLeft size={14} strokeWidth={1} />
          {product.categoryLabel}
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-cream/10 bg-charcoal-soft">
            <Image
              src={product.image}
              alt={product.fullName}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-2 text-[0.6rem] uppercase tracking-[0.25em] text-gold-muted">
              {product.categoryLabel}
            </p>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream/40">
              {product.line1}
            </p>
            <h1 className="font-serif text-4xl font-light tracking-tight text-ivory md:text-5xl">
              {product.line2}
            </h1>
            <p className="mt-4 text-lg font-light text-cream/60">{product.priceLabel}</p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-charcoal transition-colors hover:bg-gold-light"
              >
                <MessageCircle size={15} />
                {t.inquire}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
