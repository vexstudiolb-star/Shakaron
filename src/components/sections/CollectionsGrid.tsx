"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { collectionMeta } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const aspectClasses = {
  tall: "md:row-span-2",
  wide: "md:col-span-2",
  square: "",
} as const;

const heightClasses = {
  tall: "aspect-[3/4] md:aspect-auto md:min-h-[520px]",
  wide: "aspect-[4/3] md:aspect-auto md:min-h-[360px]",
  square: "aspect-square md:aspect-auto md:min-h-[400px]",
};

export function CollectionsGrid() {
  const { dict } = useLocale();

  const items = dict.collections.items.map((item) => {
    const meta = collectionMeta.find((m) => m.id === item.id)!;
    return { ...item, ...meta };
  });

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

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5"
        >
          {items.map((item) => (
            <motion.article
              key={item.id}
              variants={fadeUp}
              className={cn(
                "group relative cursor-pointer overflow-hidden",
                aspectClasses[item.aspect]
              )}
            >
              <div
                className={cn(
                  "relative h-full w-full overflow-hidden",
                  heightClasses[item.aspect]
                )}
              >
                <Image
                  src={item.image}
                  alt={`${item.title} — ${item.category}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-700 group-hover:bg-charcoal/20" />
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent p-6 md:p-8">
                <p className="mb-1 text-[0.6rem] uppercase tracking-[0.2em] text-gold-light">
                  {item.category}
                </p>
                <h3 className="font-serif text-2xl font-light text-ivory md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs font-light tracking-wide text-cream/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {item.price}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
