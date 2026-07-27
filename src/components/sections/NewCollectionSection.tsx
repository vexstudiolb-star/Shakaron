"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { RevealProductCard } from "@/components/collections/RevealProductCard";
import { useLocale } from "@/contexts/LocaleContext";
import { localeCollectionHref, localeProductHref } from "@/lib/constants";
import { useStorefrontCatalog } from "@/lib/collections/use-storefront-products";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const HOME_PREVIEW_COUNT = 3;
const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200";

export function NewCollectionSection() {
  const { locale, dict } = useLocale();
  const t = dict.newCollection;
  const { categories, forCategory, loaded } = useStorefrontCatalog();
  const [activeSlug, setActiveSlug] = useState<string>("");

  useEffect(() => {
    if (!activeSlug && categories.length > 0) {
      setActiveSlug(categories[0].slug);
    }
  }, [categories, activeSlug]);

  const active = categories.find((c) => c.slug === activeSlug) ?? categories[0];
  const products = active ? forCategory(active.slug).slice(0, HOME_PREVIEW_COUNT) : [];
  const categoryLabel =
    active == null
      ? ""
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
    <section
      id="new-collection"
      className="bg-charcoal px-6 py-24 text-cream md:py-32 lg:px-10"
      aria-labelledby="new-collection-heading"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12 md:mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 text-[0.65rem] font-light uppercase tracking-[0.3em] text-gold"
          >
            {t.eyebrow}
          </motion.p>
          <motion.h2
            id="new-collection-heading"
            variants={fadeUp}
            className="font-serif text-4xl font-light tracking-tight md:text-5xl lg:text-6xl"
          >
            {t.title}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-cream/60"
          >
            {t.description}
          </motion.p>
        </motion.div>

        {loaded && categories.length === 0 ? (
          <p className="text-center text-sm text-cream/45">
            {locale === "ar"
              ? "أضف فئات ومنتجات من لوحة التحكم لتظهر هنا."
              : "Add categories and products in Admin to show them here."}
          </p>
        ) : null}

        {categories.length > 0 ? (
          <>
            <nav
              className="mb-10 flex gap-2 overflow-x-auto pb-2 hide-scrollbar md:mb-12 md:flex-wrap md:gap-3"
              aria-label={t.title}
            >
              {categories.map((category) => {
                const activeTab = category.slug === activeSlug;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveSlug(category.slug)}
                    className={cn(
                      "shrink-0 rounded-full border px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] transition-all duration-300",
                      activeTab
                        ? "border-gold/50 bg-gold/15 text-cream"
                        : "border-cream/10 text-cream/55 hover:border-gold/30 hover:bg-cream/5 hover:text-cream"
                    )}
                    aria-pressed={activeTab}
                  >
                    {locale === "ar" ? category.nameAr : category.nameEn}
                  </button>
                );
              })}
            </nav>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mb-12 grid items-center gap-8 overflow-hidden rounded-3xl border border-cream/10 bg-charcoal-soft/80 md:grid-cols-[1.1fr_1fr]"
              >
                <div className="relative aspect-[16/10] min-h-[200px] md:aspect-auto md:min-h-[280px]">
                  <Image
                    src={heroSrc}
                    alt={categoryLabel}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 to-transparent" />
                </div>
                <div className="px-6 pb-8 md:px-8 md:py-8">
                  <p className="mb-2 text-[0.6rem] uppercase tracking-[0.25em] text-gold-muted">
                    {categoryLabel}
                  </p>
                  <h3 className="font-serif text-3xl font-light text-ivory md:text-4xl">
                    {categoryLabel}
                  </h3>
                  <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-cream/60">
                    {categoryDescription}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSlug}-products`}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {products.length === 0 ? (
                  <p className="col-span-full py-8 text-center text-sm text-cream/45">
                    {locale === "ar"
                      ? "لا منتجات في هذه الفئة بعد."
                      : "No products in this category yet."}
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
            </AnimatePresence>

            {active ? (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-12 flex justify-center md:mt-14"
              >
                <Link
                  href={localeCollectionHref(locale, active.slug)}
                  className="group inline-flex items-center gap-3 border border-cream/15 px-8 py-3.5 text-[0.65rem] font-light uppercase tracking-[0.22em] text-cream/75 transition-all duration-500 hover:border-gold hover:text-cream"
                >
                  {t.viewCategory.replace("{category}", categoryLabel)}
                  <ArrowRight
                    size={14}
                    strokeWidth={1}
                    className="transition-transform duration-500 group-hover:translate-x-0.5"
                  />
                </Link>
              </motion.div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
