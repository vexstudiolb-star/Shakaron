import Link from "next/link";
import { ExternalLink, Gem, FolderOpen, LayoutGrid, ImageIcon } from "lucide-react";

const cards = [
  {
    href: "/admin/products",
    title: "Products",
    desc: "Add, edit, and upload product & worn images",
    icon: Gem,
  },
  {
    href: "/admin/categories",
    title: "Categories",
    desc: "Manage collection categories",
    icon: FolderOpen,
  },
  {
    href: "/admin/sections",
    title: "Homepage Sections",
    desc: "Enable, disable, and reorder sections",
    icon: LayoutGrid,
  },
  {
    href: "/admin/media",
    title: "Media Library",
    desc: "Browse uploaded images",
    icon: ImageIcon,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-gold md:text-3xl">Dashboard</h1>
          <p className="mt-2 text-sm text-cream/60">
            Manage storefront content. Active products appear on the live website.
          </p>
        </div>
        <Link
          href="/en"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-lg border border-gold/30 px-4 py-2.5 text-sm text-gold hover:bg-gold/10"
        >
          <ExternalLink className="h-4 w-4" />
          Open website
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map(({ href, title, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-gold/15 bg-cream/5 p-5 transition hover:border-gold/40 hover:bg-gold/5"
          >
            <Icon className="mb-3 h-6 w-6 text-gold" />
            <h2 className="font-medium text-cream group-hover:text-gold">{title}</h2>
            <p className="mt-1 text-sm text-cream/50">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
