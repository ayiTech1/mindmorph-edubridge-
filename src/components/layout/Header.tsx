"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { LinkButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const nav = [
  {
    label: "Study Abroad",
    href: "/study-abroad",
    children: [
      { label: "United Kingdom", href: "/study-abroad/uk" },
      { label: "Canada", href: "/study-abroad/canada" },
      { label: "United States", href: "/study-abroad/usa" },
      { label: "Australia", href: "/study-abroad/australia" },
      { label: "Germany", href: "/study-abroad/germany" },
      { label: "Türkiye", href: "/study-abroad/turkey" },
      { label: "Malaysia", href: "/study-abroad/malaysia" }
    ]
  },
  {
    label: "Test Prep",
    href: "/test-prep",
    children: [
      { label: "IELTS", href: "/test-prep/ielts" },
      { label: "TOEFL", href: "/test-prep/toefl" },
      { label: "GRE", href: "/test-prep/gre" },
      { label: "GMAT", href: "/test-prep/gmat" },
      { label: "SAT", href: "/test-prep/sat" },
      { label: "PTE", href: "/test-prep/pte" },
      { label: "WASSCE resit", href: "/test-prep/wassce" }
    ]
  },
  { label: "Counselling", href: "/counselling" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E6F1FB]">
      <div className="container flex h-16 md:h-20 items-center justify-between">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-6">
          {nav.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/contact" className="text-sm font-medium text-brand-charcoal hover:text-brand-navy">
            Contact
          </Link>
          <LinkButton href="/book" size="sm">
            Book free consultation
          </LinkButton>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="lg:hidden p-2 -mr-2"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-[#E6F1FB]">
          <nav className="container py-4 flex flex-col gap-2">
            {nav.map((item) => (
              <details key={item.href} className="group" open={!item.children}>
                <summary
                  className={cn(
                    "py-3 list-none cursor-pointer flex items-center justify-between text-base font-medium",
                    !item.children && "py-3"
                  )}
                >
                  <Link href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                  {item.children && (
                    <span aria-hidden="true" className="text-brand-slate">+</span>
                  )}
                </summary>
                {item.children && (
                  <ul className="pb-2 pl-2">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className="block py-2 text-sm text-brand-charcoal/80 hover:text-brand-navy"
                          onClick={() => setOpen(false)}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </details>
            ))}
            <Link href="/contact" className="py-3 font-medium" onClick={() => setOpen(false)}>
              Contact
            </Link>
            <LinkButton href="/book" className="mt-2">
              Book free consultation
            </LinkButton>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavItem({ item }: { item: (typeof nav)[number] }) {
  if (!item.children) {
    return (
      <Link
        href={item.href}
        className="text-sm font-medium text-brand-charcoal hover:text-brand-navy"
      >
        {item.label}
      </Link>
    );
  }
  return (
    <div className="relative group">
      <Link
        href={item.href}
        className="text-sm font-medium text-brand-charcoal hover:text-brand-navy inline-flex items-center gap-1"
      >
        {item.label}
        <span aria-hidden="true" className="text-xs opacity-60">▾</span>
      </Link>
      <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition">
        <ul className="w-64 bg-white border border-[#E6F1FB] rounded-card shadow-card p-2">
          {item.children.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                className="block px-3 py-2 rounded-md text-sm text-brand-charcoal hover:bg-brand-ice hover:text-brand-navy"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
