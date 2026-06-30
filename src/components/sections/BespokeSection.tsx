"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { images, siteConfig } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";

export function BespokeSection() {
  const { dict } = useLocale();

  return (
    <section
      id="bespoke"
      className="relative overflow-hidden bg-charcoal px-6 py-24 md:py-32 lg:px-10"
      aria-labelledby="bespoke-heading"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 text-[0.65rem] font-light uppercase tracking-[0.3em] text-gold"
          >
            {dict.bespoke.eyebrow}
          </motion.p>
          <motion.h2
            id="bespoke-heading"
            variants={fadeUp}
            className="font-serif text-4xl font-light leading-tight text-ivory md:text-5xl"
          >
            {dict.bespoke.titleLine1}
            <br />
            <em className="not-italic text-gold-light">{dict.bespoke.titleAccent}</em>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-md text-sm font-light leading-relaxed text-cream/60"
          >
            {dict.bespoke.description}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10">
            <Link
              href={siteConfig.navHrefs.contact}
              className="group inline-flex items-center gap-3 text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold-light transition-colors duration-500 hover:text-cream"
            >
              {dict.bespoke.cta}
              <ArrowRight
                size={14}
                strokeWidth={1}
                className="transition-transform duration-500 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] overflow-hidden"
        >
          <Image
            src={images.necklace}
            alt={dict.bespoke.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 border border-gold/10" />
        </motion.div>
      </div>
    </section>
  );
}
