"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import "./reveal-card.css";

type RevealProductCardProps = {
  line1: string;
  line2: string;
  price: string;
  productImage: string;
  wornImage: string;
  productLabel: string;
  wornLabel: string;
  inquireLabel: string;
  href?: string;
};

function GemIcon() {
  return (
    <svg className="icon-gem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h12l4 6-10 12L2 9z" />
      <path d="M11 3 8 9l4 12 4-12-3-6" />
      <path d="M2 9h20" />
    </svg>
  );
}

function ModelIcon() {
  return (
    <svg className="icon-model" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function RevealProductCard({
  line1,
  line2,
  price,
  productImage,
  wornImage,
  productLabel,
  wornLabel,
  inquireLabel,
  href = siteConfig.contact.whatsapp,
}: RevealProductCardProps) {
  const [worn, setWorn] = useState(false);
  const [wornMounted, setWornMounted] = useState(false);
  const activeLabel = worn ? wornLabel : productLabel;

  const showWorn = () => {
    setWornMounted(true);
    setWorn(true);
  };

  return (
    <article className="reveal-card">
      <div className="reveal-card__image-wrap">
        <div className={cn("reveal-card__layer", !worn && "reveal-card__layer--active")}>
          <Image
            src={productImage}
            alt={`${line2} — ${productLabel}`}
            fill
            sizes="(max-width: 640px) 90vw, 340px"
            priority={false}
            loading="lazy"
          />
        </div>
        {wornMounted ? (
          <div className={cn("reveal-card__layer", worn && "reveal-card__layer--active")}>
            <Image
              src={wornImage}
              alt={`${line2} — ${wornLabel}`}
              fill
              sizes="(max-width: 640px) 90vw, 340px"
              loading="lazy"
            />
          </div>
        ) : null}

        <p className="reveal-card__view-label" aria-live="polite">
          {activeLabel}
        </p>

        <button
          type="button"
          className="reveal-card__switch"
          data-worn={worn}
          onClick={() => {
            if (worn) {
              setWorn(false);
            } else {
              showWorn();
            }
          }}
          role="switch"
          aria-checked={worn}
          aria-label={`Show ${worn ? productLabel : wornLabel}`}
          title={`Show ${worn ? productLabel : wornLabel}`}
        >
          <span className="reveal-card__switch-track">
            <span className="reveal-card__switch-icons">
              <GemIcon />
              <ModelIcon />
            </span>
            <span className="reveal-card__switch-circle" />
          </span>
        </button>
      </div>

      <div className="reveal-card__body">
        <span className="reveal-card__brand">{line1}</span>
        <h3 className="reveal-card__title">{line2}</h3>
        <p className="reveal-card__price">{price}</p>
        <Link
          href={href}
          className="reveal-card__cta"
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {inquireLabel}
        </Link>
      </div>
    </article>
  );
}
