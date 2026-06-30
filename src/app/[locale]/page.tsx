import { Hero } from "@/components/sections/Hero";
import { CollectionsGrid } from "@/components/sections/CollectionsGrid";
import { CraftsmanshipScroll } from "@/components/sections/CraftsmanshipScroll";
import { BespokeSection } from "@/components/sections/BespokeSection";
import { AtelierSection } from "@/components/sections/AtelierSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CollectionsGrid />
      <CraftsmanshipScroll />
      <BespokeSection />
      <AtelierSection />
    </>
  );
}
