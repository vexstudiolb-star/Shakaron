"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { atelierImages } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function AtelierSection() {
  const { dict } = useLocale();

  const gallery = dict.atelier.images.map((img, i) => ({
    ...img,
    src: atelierImages[i],
  }));

  return (
    <section
      id="atelier"
      className="bg-ivory px-6 py-24 text-charcoal md:py-32 lg:px-10"
      aria-labelledby="atelier-heading"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 max-w-2xl md:mb-24"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 text-[0.65rem] font-light uppercase tracking-[0.3em] text-gold-muted"
          >
            {dict.atelier.eyebrow}
          </motion.p>
          <motion.h2
            id="atelier-heading"
            variants={fadeUp}
            className="font-serif text-4xl font-light tracking-tight md:text-5xl lg:text-6xl"
          >
            {dict.atelier.title}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-sm font-light leading-relaxed text-charcoal/60 md:text-base"
          >
            {dict.atelier.description}
          </motion.p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {gallery.map((img, i) => (
            <motion.figure
              key={img.caption}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </div>
              <figcaption className="mt-4 text-xs font-light italic tracking-wide text-charcoal/50">
                {img.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-20 grid gap-8 border-t border-charcoal/10 pt-16 md:grid-cols-3"
        >
          {dict.atelier.stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-start">
              <p className="font-serif text-4xl font-light text-gold-muted md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-charcoal/40">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
