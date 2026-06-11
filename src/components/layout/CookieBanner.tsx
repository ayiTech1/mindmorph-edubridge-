"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const KEY = "mindmorph.cookie-consent.v1";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(KEY)) setShow(true);
  }, []);

  if (!show) return null;

  const decide = (choice: "accept" | "reject") => {
    window.localStorage.setItem(KEY, choice);
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-40 bg-white border-t border-[#E6F1FB] shadow-lg"
    >
      <div className="container py-4 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
        <p className="text-sm text-brand-charcoal/85 max-w-2xl">
          We use cookies to improve performance, understand traffic, and personalise content.
          See our <Link href="/cookie-policy" className="underline">cookie policy</Link>.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => decide("reject")}>
            Reject
          </Button>
          <Button size="sm" onClick={() => decide("accept")}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
