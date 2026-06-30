"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeUp } from "@/lib/motion";

export function Hero() {
  const { dict } = useLocale();

  return (
    <section
      className="relative flex h-screen min-h-[600px] items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={siteConfig.assets.logo}
          className="h-full w-full object-cover"
        >
          <source src={siteConfig.assets.heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.p
          variants={fadeUp}
          initial={false}
          animate="visible"
          className="mb-6 text-[0.65rem] font-light uppercase tracking-[0.35em] text-gold-light"
        >
          {dict.hero.eyebrow}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial={false}
          animate="visible"
          transition={{ delay: 0.15 }}
          className="font-serif text-5xl font-light leading-[1.05] tracking-tight text-ivory sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {dict.hero.titleLine1}
          <br />
          <em className="not-italic text-gold-light">{dict.hero.titleAccent}</em>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial={false}
          animate="visible"
          transition={{ delay: 0.3 }}
          className="mx-auto mt-8 max-w-md text-sm font-light leading-relaxed text-cream/70 md:text-base"
        >
          {dict.hero.subtitle}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial={false}
          animate="visible"
          transition={{ delay: 0.45 }}
          className="mt-12"
        >
          <Link
            href={siteConfig.navHrefs.collections}
            className="group inline-flex items-center gap-3 border border-gold/40 bg-gold/10 px-10 py-4 text-[0.65rem] font-light uppercase tracking-[0.25em] text-cream backdrop-blur-sm transition-all duration-700 hover:border-gold hover:bg-gold/20"
          >
            {dict.hero.explore}
            <ChevronDown
              size={14}
              strokeWidth={1}
              className="transition-transform duration-500 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 start-1/2 z-10 -translate-x-1/2 rtl:translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-cream/40">
            {dict.hero.scroll}
          </span>
          <div className="h-10 w-px bg-gradient-to-b from-gold/60 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
