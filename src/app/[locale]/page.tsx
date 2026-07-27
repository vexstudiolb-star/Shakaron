import { Hero } from "@/components/sections/Hero";
import { NewCollectionSection } from "@/components/sections/NewCollectionSection";
import { CollectionsGrid } from "@/components/sections/CollectionsGrid";
import { CraftsmanshipScroll } from "@/components/sections/CraftsmanshipScroll";
import { BespokeSection } from "@/components/sections/BespokeSection";
import { AtelierSection } from "@/components/sections/AtelierSection";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/server";

const SECTION_MAP = {
  hero: Hero,
  "new-collection": NewCollectionSection,
  collections: CollectionsGrid,
  craftsmanship: CraftsmanshipScroll,
  bespoke: BespokeSection,
  atelier: AtelierSection,
} as const;

const DEFAULT_ORDER = Object.keys(SECTION_MAP) as (keyof typeof SECTION_MAP)[];

async function getEnabledSectionSlugs(): Promise<(keyof typeof SECTION_MAP)[]> {
  if (!isSupabaseConfigured()) return DEFAULT_ORDER;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return DEFAULT_ORDER;

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("homepage_sections")
      .select("slug, is_enabled, sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return DEFAULT_ORDER;

    const enabled = data
      .filter((row) => row.is_enabled)
      .map((row) => row.slug)
      .filter((slug): slug is keyof typeof SECTION_MAP => slug in SECTION_MAP);

    return enabled.length > 0 ? enabled : DEFAULT_ORDER;
  } catch {
    return DEFAULT_ORDER;
  }
}

export default async function HomePage() {
  const sections = await getEnabledSectionSlugs();

  return (
    <>
      {sections.map((slug) => {
        const Section = SECTION_MAP[slug];
        return <Section key={slug} />;
      })}
    </>
  );
}
