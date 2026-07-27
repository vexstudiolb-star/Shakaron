"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderOpen,
  Gem,
  Home,
  ImageIcon,
  LayoutGrid,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home, exact: true },
  { href: "/admin/products", label: "Products", icon: Gem },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/sections", label: "Sections", icon: LayoutGrid },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const logout = async () => {
    await fetch("/api/admin/auth/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const linkClass = (href: string, exact?: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
      isActive(href, exact)
        ? "bg-gold/15 text-gold"
        : "text-cream/70 hover:bg-cream/5 hover:text-cream"
    }`;

  const NavLinks = () => (
    <>
      {navItems.map(({ href, label, icon: Icon, exact }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={linkClass(href, exact)}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </Link>
      ))}
      <button
        type="button"
        onClick={() => void logout()}
        className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/60 hover:bg-red-500/10 hover:text-red-300"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gold/15 bg-charcoal/95 px-4 py-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-cream hover:bg-cream/10"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-serif text-sm tracking-wide text-gold">Shakaron Admin</span>
        <div className="w-9" />
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-gold/15 bg-charcoal p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-serif text-gold">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-cream hover:bg-cream/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              <NavLinks />
            </nav>
          </aside>
        </div>
      ) : null}

      <aside className="hidden w-56 shrink-0 border-r border-gold/15 bg-charcoal/50 p-4 md:block">
        <p className="mb-6 font-serif text-lg text-gold">Shakaron</p>
        <nav className="flex flex-col gap-1">
          <NavLinks />
        </nav>
        <Link
          href="/en"
          target="_blank"
          className="mt-6 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-gold/80 hover:bg-gold/10 hover:text-gold"
        >
          Open website ↗
        </Link>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-gold/15 bg-charcoal/95 px-2 py-2 backdrop-blur md:hidden">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] ${
              isActive(href, exact) ? "text-gold" : "text-cream/50"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label.split(" ")[0]}
          </Link>
        ))}
      </nav>
    </>
  );
}
