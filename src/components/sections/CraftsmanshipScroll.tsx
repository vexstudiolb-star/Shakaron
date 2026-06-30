"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { craftsmanshipImages } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeUp } from "@/lib/motion";

type Step = {
  step: string;
  title: string;
  description: string;
  image: string;
};

function StepCard({ step, className = "" }: { step: Step; className?: string }) {
  return (
    <article className={`relative shrink-0 ${className}`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={step.image}
          alt={step.title}
          fill
          sizes="(max-width: 768px) 85vw, 45vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
        <span className="mb-3 block font-serif text-sm text-gold">{step.step}</span>
        <h3 className="mb-3 font-serif text-2xl font-light text-ivory md:text-3xl">
          {step.title}
        </h3>
        <p className="max-w-md text-sm font-light leading-relaxed text-cream/60">
          {step.description}
        </p>
      </div>
    </article>
  );
}

export function CraftsmanshipScroll() {
  const { locale, dict } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const isRtl = locale === "ar";
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    isRtl ? ["0%", "65%"] : ["0%", "-65%"]
  );

  const steps: Step[] = dict.craftsmanship.steps.map((step, i) => ({
    ...step,
    image: craftsmanshipImages[i],
  }));

  return (
    <section
      ref={containerRef}
      className="relative bg-charcoal-soft"
      aria-labelledby="craftsmanship-heading"
    >
      <div className="px-6 py-24 md:hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-10"
        >
          <p className="mb-3 text-[0.65rem] font-light uppercase tracking-[0.3em] text-gold">
            {dict.craftsmanship.eyebrow}
          </p>
          <h2
            id="craftsmanship-heading"
            className="font-serif text-3xl font-light text-cream"
          >
            {dict.craftsmanship.title}
          </h2>
        </motion.div>

        <div
          className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-4 hide-scrollbar snap-x snap-mandatory"
          role="region"
          aria-label={dict.craftsmanship.stagesAria}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {steps.map((step) => (
            <StepCard key={step.step} step={step} className="w-[85vw] snap-center" />
          ))}
        </div>
        <p className="mt-6 text-[0.6rem] uppercase tracking-[0.25em] text-cream/30">
          {dict.craftsmanship.swipeHint}
        </p>
      </div>

      <div className="relative hidden h-[300vh] md:block">
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
          <div className="shrink-0 px-10 pt-32 pb-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mx-auto max-w-7xl"
            >
              <p className="mb-3 text-[0.65rem] font-light uppercase tracking-[0.3em] text-gold">
                {dict.craftsmanship.eyebrow}
              </p>
              <h2 className="font-serif text-5xl font-light text-cream">
                {dict.craftsmanship.title}
              </h2>
            </motion.div>
          </div>

          <div className="flex flex-1 items-center overflow-hidden">
            <motion.div style={{ x }} className="flex gap-8 px-10" dir="ltr">
              {steps.map((step) => (
                <StepCard key={step.step} step={step} className="w-[45vw]" />
              ))}
            </motion.div>
          </div>

          <div className="shrink-0 px-10 pb-8">
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-cream/30">
              {dict.craftsmanship.scrollHint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
