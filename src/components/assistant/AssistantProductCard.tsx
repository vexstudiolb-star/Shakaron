"use client";

import Image from "next/image";
import Link from "next/link";
import type { AssistantProduct } from "@/lib/assistant/respond";

type AssistantProductCardProps = {
  product: AssistantProduct;
  viewLabel: string;
};

export function AssistantProductCard({ product, viewLabel }: AssistantProductCardProps) {
  return (
    <Link
      href={product.href}
      className="group flex gap-3 rounded-2xl border border-cream/10 bg-charcoal-soft/80 p-2.5 transition-all hover:border-gold/30 hover:bg-charcoal-muted"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
        <p className="truncate text-[0.55rem] uppercase tracking-[0.15em] text-gold-muted">
          {product.category}
        </p>
        <p className="truncate font-serif text-sm font-light text-ivory">{product.name}</p>
        <p className="mt-0.5 text-[0.65rem] text-cream/45">{product.price}</p>
        <span className="mt-1 text-[0.6rem] uppercase tracking-[0.12em] text-gold/80 group-hover:text-gold">
          {viewLabel} →
        </span>
      </div>
    </Link>
  );
}
