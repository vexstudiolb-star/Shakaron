import dynamic from "next/dynamic";

export const JewelryScene = dynamic(
  () => import("./JewelryScene").then((mod) => mod.JewelryScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[45vh] h-[50vh] w-full items-center justify-center rounded-sm border border-gold/10 bg-charcoal-soft lg:h-full lg:min-h-[480px]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border border-gold/30 border-t-gold" />
          <p className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-cream/50">
            Loading preview
          </p>
        </div>
      </div>
    ),
  }
);
