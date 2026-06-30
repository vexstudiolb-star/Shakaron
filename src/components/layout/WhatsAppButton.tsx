"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export function WhatsAppButton() {
  const { dict } = useLocale();

  return (
    <Link
      href={siteConfig.contact.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.footer.whatsappAria}
      className="fixed bottom-6 end-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform duration-500 hover:scale-105 hover:shadow-xl md:bottom-8 md:end-8"
    >
      <WhatsAppIcon size={28} />
    </Link>
  );
}
