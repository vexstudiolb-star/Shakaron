"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import {
  CATEGORY_HERO_IMAGES,
  COLLECTION_CATEGORIES,
  productsForCategory,
  type CollectionCategory,
} from "@/lib/collections/catalog";
import { localeProductHref } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { RevealProductCard } from "./RevealProductCard";

type CollectionShowcaseProps = {
  activeCategory: CollectionCategory;
};

export function CollectionShowcase({ activeCategory }: CollectionShowcaseProps) {
  const { locale, dict } = useLocale();
  const t = dict.newCollection;
  const products = productsForCategory(activeCategory);

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
          {COLLECTION_CATEGORIES.map((category) => {
            const active = category === activeCategory;
            return (
              <Link
                key={category}
                href={`/${locale}/collections/${category}`}
                className={cn(
                  "shrink-0 rounded-full border px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] transition-all duration-300",
                  active
                    ? "border-gold/50 bg-gold/15 text-cream"
                    : "border-cream/10 text-cream/55 hover:border-gold/30 hover:bg-cream/5 hover:text-cream"
                )}
                aria-current={active ? "page" : undefined}
              >
                {t.categories[category]}
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
              src={CATEGORY_HERO_IMAGES[activeCategory]}
              alt={t.categories[activeCategory]}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/30 to-transparent" />
          </div>
          <div className="px-6 pb-8 md:px-8 md:py-8">
            <p className="mb-2 text-[0.6rem] uppercase tracking-[0.25em] text-gold-muted">
              {t.categories[activeCategory]}
            </p>
            <h2 className="font-serif text-3xl font-light text-ivory md:text-4xl">
              {t.categories[activeCategory]}
            </h2>
            <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-cream/60">
              {t.categoryDescriptions[activeCategory]}
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
      </div>
    </section>
  );
}
