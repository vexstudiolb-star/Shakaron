"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { useStorefrontCatalog } from "@/lib/collections/use-storefront-products";
import { localeCollectionHref } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FALLBACK =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200";

const aspectCycle = ["tall", "wide", "square"] as const;

export function CollectionsGrid() {
  const { locale, dict } = useLocale();
  const { categories, forCategory, loaded } = useStorefrontCatalog();

  return (
    <section
      id="collections"
      className="bg-ivory px-6 py-24 text-charcoal md:py-32 lg:px-10"
      aria-labelledby="collections-heading"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 md:mb-20"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 text-[0.65rem] font-light uppercase tracking-[0.3em] text-gold-muted"
          >
            {dict.collections.eyebrow}
          </motion.p>
          <motion.h2
            id="collections-heading"
            variants={fadeUp}
            className="font-serif text-4xl font-light tracking-tight md:text-5xl lg:text-6xl"
          >
            {dict.collections.title}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-sm font-light leading-relaxed text-charcoal/60"
          >
            {dict.collections.description}
          </motion.p>
        </motion.div>

        {loaded && categories.length === 0 ? (
          <p className="text-center text-sm text-charcoal/45">
            {locale === "ar"
              ? "أضف فئات من لوحة التحكم لتظهر هنا."
              : "Add categories in Admin to show them here."}
          </p>
        ) : null}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5"
        >
          {categories.map((category, index) => {
            const aspect = aspectCycle[index % aspectCycle.length];
            const products = forCategory(category.slug);
            const image =
              category.heroImageUrl || products[0]?.images[0] || FALLBACK;
            const title = locale === "ar" ? category.nameAr : category.nameEn;
            const description =
              locale === "ar" ? category.descriptionAr : category.descriptionEn;

            return (
              <motion.article
                key={category.id}
                variants={fadeUp}
                className={cn(
                  "group relative overflow-hidden",
                  aspect === "tall" && "md:row-span-2",
                  aspect === "wide" && "md:col-span-2"
                )}
              >
                <Link
                  href={localeCollectionHref(locale, category.slug)}
                  className={cn(
                    "relative block overflow-hidden",
                    aspect === "tall" && "aspect-[3/4] md:aspect-auto md:min-h-[520px]",
                    aspect === "wide" && "aspect-[4/3] md:aspect-auto md:min-h-[360px]",
                    aspect === "square" && "aspect-square md:aspect-auto md:min-h-[400px]"
                  )}
                >
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <h3 className="font-serif text-2xl font-light text-ivory md:text-3xl">
                      {title}
                    </h3>
                    {description ? (
                      <p className="mt-2 max-w-sm text-sm font-light text-cream/70">
                        {description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
