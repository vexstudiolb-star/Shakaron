"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export function Footer() {
  const { dict } = useLocale();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  const socialLabels = {
    whatsapp: dict.footer.social.whatsapp,
    instagram: dict.footer.social.instagram,
  };

  return (
    <footer
      id="contact"
      className="border-t border-gold/10 bg-charcoal px-6 py-20 lg:px-10"
      aria-labelledby="footer-heading"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-16 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <div id="footer-heading">
              <Image
                src={siteConfig.assets.logo}
                alt={dict.meta.name}
                width={200}
                height={72}
                className="mb-4 h-10 w-auto object-contain"
              />
              <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-cream/50">
                {dict.meta.tagline}. {dict.footer.visit} {dict.location.display}.
              </p>
              <address className="mt-6 not-italic text-sm font-light leading-loose text-cream/60">
                {dict.location.region}
                <br />
                {dict.location.country}
                <br />
                <a
                  href={`tel:${siteConfig.contact.phoneTel}`}
                  className="transition-colors hover:text-gold-light"
                  dir="ltr"
                >
                  {siteConfig.contact.phone}
                </a>
              </address>

              <Link
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-5 py-3 text-sm font-light text-cream transition-all duration-500 hover:border-[#25D366] hover:bg-[#25D366]/20"
                aria-label={dict.footer.whatsappAria}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <WhatsAppIcon size={18} />
                </span>
                {dict.footer.whatsapp}
              </Link>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="mb-4 text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
              {dict.footer.newsletter}
            </h3>
            <p className="mb-6 text-sm font-light text-cream/50">
              {dict.footer.newsletterDesc}
            </p>
            {submitted ? (
              <p className="text-sm text-gold-light" role="status">
                {dict.footer.subscribed}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label htmlFor="newsletter-email" className="sr-only">
                  {dict.footer.emailLabel}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dict.footer.emailPlaceholder}
                  className="border-b border-cream/20 bg-transparent py-3 text-sm font-light text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none"
                  dir="ltr"
                />
                <button
                  type="submit"
                  className="mt-2 w-fit text-[0.65rem] uppercase tracking-[0.25em] text-gold-light transition-colors hover:text-cream"
                >
                  {dict.footer.subscribe}
                </button>
              </form>
            )}
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="mb-4 text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
              {dict.footer.connect}
            </h3>
            <ul className="flex flex-col gap-4">
              {siteConfig.social.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 text-sm font-light text-cream/50 transition-colors hover:text-cream"
                    aria-label={
                      link.id === "whatsapp"
                        ? `${dict.footer.chatWhatsApp} — ${siteConfig.contact.phone}`
                        : dict.footer.followInstagram
                    }
                  >
                    {link.id === "instagram" ? (
                      <Instagram size={16} strokeWidth={1} />
                    ) : (
                      <WhatsAppIcon size={16} />
                    )}
                    {socialLabels[link.id]}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-gold/10 pt-8 text-[0.65rem] uppercase tracking-[0.15em] text-cream/30 md:flex-row">
          <p>
            © {new Date().getFullYear()} {dict.meta.name}. {dict.footer.rights}
          </p>
          <div className="flex gap-6">
            <Link href="#" className="transition-colors hover:text-cream/60">
              {dict.footer.privacy}
            </Link>
            <Link href="#" className="transition-colors hover:text-cream/60">
              {dict.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
