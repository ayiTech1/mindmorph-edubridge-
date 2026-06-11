"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Sticky "Book free consultation" button — spec §6.1.
 * Appears after the visitor scrolls past the hero on mobile.
 * Hidden on /book and /admin (avoids self-CTA).
 */
export function StickyCTA() {
  const pathname = usePathname() || "/";
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 700);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (
    pathname.startsWith("/admin") ||
    pathname === "/book" ||
    pathname.startsWith("/book/")
  ) {
    return null;
  }

  return (
    <div
      aria-hidden={!show}
      className={`md:hidden fixed bottom-0 inset-x-0 z-30 px-4 pb-4 transition-transform duration-200 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Link
        href="/book"
        className="flex items-center justify-center h-12 w-full rounded-lg bg-brand-navy text-white font-medium shadow-lg pr-16"
      >
        Book free consultation →
      </Link>
    </div>
  );
}
