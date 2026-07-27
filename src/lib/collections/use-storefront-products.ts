"use client";

import { useEffect, useState } from "react";

export type ClientStorefrontCategory = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  heroImageUrl: string | null;
  sortOrder: number;
};

export type ClientStorefrontProduct = {
  id: string;
  category: string;
  images: readonly string[];
  wornImage: string;
  line1En: string;
  line1Ar: string;
  line2En: string;
  line2Ar: string;
  priceEn: string;
  priceAr: string;
  source: "cms";
};

export function useStorefrontCatalog() {
  const [categories, setCategories] = useState<ClientStorefrontCategory[]>([]);
  const [products, setProducts] = useState<ClientStorefrontProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [fromCms, setFromCms] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/catalog", { cache: "no-store" });
        const body = await res.json();
        if (cancelled) return;
        setCategories(Array.isArray(body.categories) ? body.categories : []);
        setProducts(Array.isArray(body.products) ? body.products : []);
        setFromCms(Boolean(body.fromCms));
      } catch {
        if (!cancelled) {
          setCategories([]);
          setProducts([]);
          setFromCms(false);
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const forCategory = (categorySlug: string) =>
    products.filter((p) => p.category === categorySlug);

  return { categories, products, forCategory, loaded, fromCms };
}
