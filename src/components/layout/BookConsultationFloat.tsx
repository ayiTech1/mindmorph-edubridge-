"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Floating "Book free consultation" button — bottom-LEFT.
 *
 * Mirrors the WhatsApp float on the bottom-right. Persistent on the marketing
 * site, hidden on the booking page itself and on /admin.
 *
 * Hover behaviour expands the pill so the label reveals — keeps the resting
 * footprint small but invites the click on intent.
 */
export function BookConsultationFloat() {
  const pathname = usePathname() || "/";
  if (
    pathname.startsWith("/admin") ||
    pathname === "/book" ||
    pathname.startsWith("/book/")
  ) {
    return null;
  }

  return (
    <Link
      href="/book"
      aria-label="Book your free consultation"
      className="
        group fixed bottom-5 left-5 z-30
        inline-flex items-center
        h-14 rounded-full
        bg-brand-navy text-white shadow-lg
        transition-all duration-200
        hover:bg-brand-ocean hover:shadow-xl hover:scale-[1.02]
        w-14 hover:w-auto hover:pr-5
        overflow-hidden
      "
    >
      <span
        aria-hidden="true"
        className="shrink-0 w-14 h-14 inline-flex items-center justify-center"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18M9 14h.01M13 14h.01M17 14h.01M9 18h.01M13 18h.01" />
        </svg>
      </span>
      <span className="pr-2 whitespace-nowrap font-medium text-sm hidden md:inline-block opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[20rem] transition-all duration-300 origin-left">
        Book free consultation
      </span>
      {/* Subtle "Free" badge — visible only on mobile where there's no hover. */}
      <span
        aria-hidden="true"
        className="md:hidden absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-teal text-[10px] font-bold text-white inline-flex items-center justify-center ring-2 ring-brand-cream"
      >
        +
      </span>
    </Link>
  );
}
