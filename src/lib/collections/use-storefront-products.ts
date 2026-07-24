"use client";

import { useEffect, useState } from "react";
import {
  COLLECTION_PRODUCTS,
  type CollectionCategory,
  type CollectionProduct,
} from "@/lib/collections/catalog";

export type ClientStorefrontProduct = CollectionProduct & {
  line1En: string;
  line1Ar: string;
  line2En: string;
  line2Ar: string;
  priceEn: string;
  priceAr: string;
  source: "cms" | "static";
};

function staticFallback(): ClientStorefrontProduct[] {
  return COLLECTION_PRODUCTS.map((p) => ({
    ...p,
    line1En: "",
    line1Ar: "",
    line2En: "",
    line2Ar: "",
    priceEn: "",
    priceAr: "",
    source: "static" as const,
  }));
}

export function useStorefrontProducts() {
  const [products, setProducts] = useState<ClientStorefrontProduct[]>(staticFallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/catalog");
        const body = await res.json();
        if (!cancelled && Array.isArray(body.products) && body.products.length > 0) {
          setProducts(body.products as ClientStorefrontProduct[]);
        }
      } catch {
        // keep static fallback
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const forCategory = (category: CollectionCategory) =>
    products.filter((p) => p.category === category);

  return { products, forCategory, loaded };
}
