"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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

type CatalogState = {
  categories: ClientStorefrontCategory[];
  products: ClientStorefrontProduct[];
  loaded: boolean;
  fromCms: boolean;
  forCategory: (categorySlug: string) => ClientStorefrontProduct[];
  refresh: () => Promise<void>;
};

const CatalogContext = createContext<CatalogState | null>(null);

let sharedPromise: Promise<{
  categories: ClientStorefrontCategory[];
  products: ClientStorefrontProduct[];
  fromCms: boolean;
}> | null = null;

async function fetchCatalogOnce() {
  if (!sharedPromise) {
    sharedPromise = (async () => {
      try {
        const res = await fetch("/api/catalog", { cache: "no-store" });
        const body = await res.json();
        return {
          categories: Array.isArray(body.categories) ? body.categories : [],
          products: Array.isArray(body.products) ? body.products : [],
          fromCms: Boolean(body.fromCms),
        };
      } catch {
        return { categories: [], products: [], fromCms: false };
      }
    })();
  }
  return sharedPromise;
}

export function StorefrontCatalogProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<ClientStorefrontCategory[]>([]);
  const [products, setProducts] = useState<ClientStorefrontProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [fromCms, setFromCms] = useState(false);

  const refresh = useCallback(async () => {
    sharedPromise = null;
    const catalog = await fetchCatalogOnce();
    setCategories(catalog.categories);
    setProducts(catalog.products);
    setFromCms(catalog.fromCms);
    setLoaded(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const catalog = await fetchCatalogOnce();
      if (cancelled) return;
      setCategories(catalog.categories);
      setProducts(catalog.products);
      setFromCms(catalog.fromCms);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const forCategory = useCallback(
    (categorySlug: string) => products.filter((p) => p.category === categorySlug),
    [products]
  );

  const value = useMemo(
    () => ({ categories, products, loaded, fromCms, forCategory, refresh }),
    [categories, products, loaded, fromCms, forCategory, refresh]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useStorefrontCatalog() {
  const ctx = useContext(CatalogContext);
  const [categories, setCategories] = useState<ClientStorefrontCategory[]>([]);
  const [products, setProducts] = useState<ClientStorefrontProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [fromCms, setFromCms] = useState(false);

  useEffect(() => {
    if (ctx) return;
    let cancelled = false;
    void (async () => {
      const catalog = await fetchCatalogOnce();
      if (cancelled) return;
      setCategories(catalog.categories);
      setProducts(catalog.products);
      setFromCms(catalog.fromCms);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [ctx]);

  const forCategory = useCallback(
    (categorySlug: string) => {
      const list = ctx?.products ?? products;
      return list.filter((p) => p.category === categorySlug);
    },
    [ctx?.products, products]
  );

  if (ctx) return ctx;

  return { categories, products, forCategory, loaded, fromCms, refresh: async () => undefined };
}
