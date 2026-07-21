"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { RevealProductCard } from "@/components/collections/RevealProductCard";
import { useLocale } from "@/contexts/LocaleContext";
import { localeCollectionHref, localeProductHref } from "@/lib/constants";
import {
  CATEGORY_HERO_IMAGES,
  COLLECTION_CATEGORIES,
  productsForCategory,
  type CollectionCategory,
} from "@/lib/collections/catalog";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const HOME_PREVIEW_COUNT = 3;

export function NewCollectionSection() {
  const { locale, dict } = useLocale();
  const t = dict.newCollection;
  const [activeCategory, setActiveCategory] = useState<CollectionCategory>("rings");
  const products = productsForCategory(activeCategory).slice(0, HOME_PREVIEW_COUNT);
  const categoryLabel = t.categories[activeCategory];

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

        <nav
          className="mb-10 flex gap-2 overflow-x-auto pb-2 hide-scrollbar md:mb-12 md:flex-wrap md:gap-3"
          aria-label={t.title}
        >
          {COLLECTION_CATEGORIES.map((category) => {
            const active = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "shrink-0 rounded-full border px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] transition-all duration-300",
                  active
                    ? "border-gold/50 bg-gold/15 text-cream"
                    : "border-cream/10 text-cream/55 hover:border-gold/30 hover:bg-cream/5 hover:text-cream"
                )}
                aria-pressed={active}
              >
                {t.categories[category]}
              </button>
            );
          })}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 grid items-center gap-8 overflow-hidden rounded-3xl border border-cream/10 bg-charcoal-soft/80 md:grid-cols-[1.1fr_1fr]"
          >
            <div className="relative aspect-[16/10] min-h-[200px] md:aspect-auto md:min-h-[280px]">
              <Image
                src={CATEGORY_HERO_IMAGES[activeCategory]}
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
                {t.categoryDescriptions[activeCategory]}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-products`}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {products.map((product) => {
              const copy = t.products[product.id as keyof typeof t.products];
              return (
                <motion.div key={product.id} variants={fadeUp} className="w-full max-w-[340px]">
                  <RevealProductCard
                    line1={copy.line1}
                    line2={copy.line2}
                    price={t.priceOnRequest}
                    productImage={product.images[0]}
                    wornImage={product.wornImage}
                    productLabel={t.viewProduct}
                    wornLabel={t.viewWorn}
                    inquireLabel={t.inquire}
                    href={localeProductHref(locale, product.category, product.id)}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 flex justify-center md:mt-14"
        >
          <Link
            href={localeCollectionHref(locale, activeCategory)}
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
      </div>
    </section>
  );
}
