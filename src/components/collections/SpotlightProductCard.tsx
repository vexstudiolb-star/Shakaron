"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { siteConfig } from "@/lib/constants";
import "./spotlight-card.css";

type SpotlightProductCardProps = {
  line1: string;
  line2: string;
  price: string;
  images: readonly string[];
  inquireLabel: string;
  href?: string;
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SpotlightProductCard({
  line1,
  line2,
  price,
  images,
  inquireLabel,
  href = siteConfig.contact.whatsapp,
}: SpotlightProductCardProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const titleId = `${line2.replace(/\s+/g, "-").toLowerCase()}-title`;

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(index);
  }, []);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
    setActiveIndex(index);
  };

  return (
    <article className="spotlight-card">
      <div className="spotlight-card__carousel">
        <ul
          ref={trackRef}
          className="spotlight-card__track"
          onScroll={onScroll}
          aria-label={`${line2} gallery`}
        >
          {images.map((src, index) => (
            <li key={src} className="spotlight-card__slide">
              <div className="spotlight-card__image">
                <Image
                  src={src}
                  alt={index === 0 ? line2 : `${line2} view ${index + 1}`}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            </li>
          ))}
        </ul>

        {images.length > 1 && (
          <div
            className="spotlight-card__markers"
            role="tablist"
            aria-label={`${line2} slides`}
          >
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                className="spotlight-card__marker"
                aria-selected={activeIndex === index}
                aria-label={`Slide ${index + 1} of ${images.length}`}
                onClick={(event) => {
                  event.stopPropagation();
                  scrollTo(index);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="spotlight-card__body">
        <div className="spotlight-card__meta">
          <h2 id={titleId}>
            <span>{line1}</span>
            <span>{line2}</span>
          </h2>
          <p>{price}</p>
        </div>

        <Link
          href={href}
          className="spotlight-card__cta"
          target="_blank"
          rel="noopener noreferrer"
          aria-labelledby={`${titleId}-cta ${titleId}`}
        >
          <span className="spotlight-card__sr-only" id={`${titleId}-cta`}>
            {inquireLabel}
          </span>
          <span className="spotlight-card__icons">
            <ArrowIcon />
            <ArrowIcon />
          </span>
        </Link>
      </div>
    </article>
  );
}
