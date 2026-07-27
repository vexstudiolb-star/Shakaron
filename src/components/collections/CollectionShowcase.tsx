"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { useStorefrontCatalog } from "@/lib/collections/use-storefront-products";
import { localeProductHref } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { RevealProductCard } from "./RevealProductCard";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200";

type CollectionShowcaseProps = {
  activeCategory: string;
};

export function CollectionShowcase({ activeCategory }: CollectionShowcaseProps) {
  const { locale, dict } = useLocale();
  const t = dict.newCollection;
  const { categories, forCategory, loaded } = useStorefrontCatalog();
  const products = forCategory(activeCategory);
  const active = categories.find((c) => c.slug === activeCategory);
  const categoryLabel =
    active == null
      ? activeCategory
      : locale === "ar"
        ? active.nameAr
        : active.nameEn;
  const categoryDescription =
    active == null
      ? ""
      : locale === "ar"
        ? active.descriptionAr || t.description
        : active.descriptionEn || t.description;
  const heroSrc = active?.heroImageUrl || products[0]?.images[0] || FALLBACK_HERO;

  return (
    <section className="bg-charcoal px-6 pb-24 pt-28 text-cream md:pb-32 md:pt-36 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-12 md:mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 text-[0.65rem] font-light uppercase tracking-[0.3em] text-gold"
          >
            {t.eyebrow}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-serif text-4xl font-light tracking-tight md:text-5xl lg:text-6xl"
          >
            {t.title}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-cream/60"
          >
            {t.description}
          </motion.p>
        </motion.div>

        <nav
          className="mb-10 flex gap-2 overflow-x-auto pb-2 hide-scrollbar md:mb-14 md:flex-wrap md:gap-3"
          aria-label={t.title}
        >
          {categories.map((category) => {
            const isActive = category.slug === activeCategory;
            return (
              <Link
                key={category.id}
                href={`/${locale}/collections/${category.slug}`}
                className={cn(
                  "shrink-0 rounded-full border px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] transition-all duration-300",
                  isActive
                    ? "border-gold/50 bg-gold/15 text-cream"
                    : "border-cream/10 text-cream/55 hover:border-gold/30 hover:bg-cream/5 hover:text-cream"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {locale === "ar" ? category.nameAr : category.nameEn}
              </Link>
            );
          })}
        </nav>

        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 grid items-center gap-8 overflow-hidden rounded-3xl border border-cream/10 bg-charcoal-soft/80 md:grid-cols-[1.1fr_1fr]"
        >
          <div className="relative aspect-[16/10] min-h-[220px] md:aspect-auto md:min-h-[320px]">
            <Image
              src={heroSrc}
              alt={categoryLabel}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/30 to-transparent" />
          </div>
          <div className="px-6 pb-8 md:px-8 md:py-8">
            <p className="mb-2 text-[0.6rem] uppercase tracking-[0.25em] text-gold-muted">
              {categoryLabel}
            </p>
            <h2 className="font-serif text-3xl font-light text-ivory md:text-4xl">
              {categoryLabel}
            </h2>
            <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-cream/60">
              {categoryDescription}
            </p>
          </div>
        </motion.div>

        <motion.div
          key={`${activeCategory}-grid`}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {loaded && products.length === 0 ? (
            <p className="col-span-full py-10 text-center text-sm text-cream/45">
              {locale === "ar"
                ? "لا منتجات في هذه الفئة بعد — أضفها من لوحة التحكم."
                : "No products in this category yet — add them in Admin."}
            </p>
          ) : null}
          {products.map((product) => (
            <motion.div key={product.id} variants={fadeUp} className="w-full max-w-[340px]">
              <RevealProductCard
                line1={locale === "ar" ? product.line1Ar : product.line1En}
                line2={locale === "ar" ? product.line2Ar : product.line2En}
                price={locale === "ar" ? product.priceAr : product.priceEn}
                productImage={product.images[0]}
                wornImage={product.wornImage}
                productLabel={t.viewProduct}
                wornLabel={t.viewWorn}
                inquireLabel={t.inquire}
                href={localeProductHref(locale, product.category, product.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
