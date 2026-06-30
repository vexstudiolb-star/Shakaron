"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/constants";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { locale, dict } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: dict.nav.collections, href: siteConfig.navHrefs.collections },
    { label: dict.nav.bespoke, href: siteConfig.navHrefs.bespoke },
    { label: dict.nav.atelier, href: siteConfig.navHrefs.atelier },
    { label: dict.nav.contact, href: siteConfig.navHrefs.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? "border-b border-gold/10 bg-charcoal/90 py-4 backdrop-blur-xl"
            : "bg-transparent py-6 md:py-8"
        )}
      >
        <nav
          className="relative mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10"
          aria-label="Main navigation"
        >
          <ul className="hidden items-center gap-8 md:flex">
            {navItems.slice(0, 2).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[0.7rem] font-light uppercase tracking-[0.2em] text-cream/70 transition-colors duration-500 hover:text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <BrandLogo
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
            priority
            locale={locale}
            alt={dict.common.home}
          />

          <div className="flex items-center gap-4 md:gap-6">
            <ul className="hidden items-center gap-8 lg:flex">
              {navItems.slice(2).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.7rem] font-light uppercase tracking-[0.2em] text-cream/70 transition-colors duration-500 hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center text-cream md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? dict.common.closeMenu : dict.common.openMenu}
            >
              {menuOpen ? <X size={22} strokeWidth={1} /> : <Menu size={22} strokeWidth={1} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-charcoal/98 backdrop-blur-2xl md:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex h-full flex-col items-center justify-center gap-10"
            >
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif text-3xl font-light tracking-wide text-cream"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <LanguageSwitcher />
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
