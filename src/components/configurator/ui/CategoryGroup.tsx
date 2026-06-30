import type { ReactNode } from "react";

type CategoryGroupProps = {
  title: string;
  children: ReactNode;
};

export function CategoryGroup({ title, children }: CategoryGroupProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}
