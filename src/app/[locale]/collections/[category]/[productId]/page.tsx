import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { getProductKnowledge } from "@/lib/assistant/product-knowledge";
import { localeCollectionHref, siteConfig } from "@/lib/constants";
import { COLLECTION_PRODUCTS, isCollectionCategory } from "@/lib/collections/catalog";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = {
  params: Promise<{ locale: string; category: string; productId: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    COLLECTION_PRODUCTS.map((product) => ({
      locale,
      category: product.category,
      productId: product.id,
    }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale: localeParam, productId } = await params;
  if (!isLocale(localeParam)) return {};
  const product = getProductKnowledge(localeParam, productId);
  if (!product) return {};
  return {
    title: product.fullName,
    description: `${product.fullName} — ${product.categoryLabel}`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale: localeParam, category, productId } = await params;

  if (!isLocale(localeParam) || !isCollectionCategory(category)) notFound();

  const product = getProductKnowledge(localeParam, productId);
  if (!product || product.category !== category) notFound();

  const dict = getDictionary(localeParam);
  const t = dict.newCollection;

  return (
    <section className="bg-charcoal px-6 pb-24 pt-28 text-cream md:pb-32 md:pt-36 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href={localeCollectionHref(localeParam, category)}
          className="mb-8 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-cream/50 transition-colors hover:text-gold"
        >
          <ArrowLeft size={14} strokeWidth={1} />
          {t.categories[category]}
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
            <p className="mt-6 text-sm font-light leading-relaxed text-cream/50">
              {t.categoryDescriptions[category]}
            </p>

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
              <Link
                href={`/${localeParam}/configurator`}
                className="inline-flex items-center gap-2 rounded-full border border-cream/15 px-8 py-3.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-cream/70 transition-colors hover:border-gold/40 hover:text-cream"
              >
                {dict.assistant.designYourOwn}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
