"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { CookieBanner } from "./CookieBanner";

/**
 * Renders the marketing footer + cookie banner only on public routes.
 * Admin pages render their own shell via `src/app/admin/layout.tsx`.
 */
export function PublicFooterChrome() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <Footer />
      <CookieBanner />
    </>
  );
}
