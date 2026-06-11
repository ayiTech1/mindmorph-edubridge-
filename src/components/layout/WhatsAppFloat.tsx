"use client";

import { usePathname } from "next/navigation";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// Auto-tailors the WhatsApp message to the page the visitor is on (spec §6.1).
function messageFor(pathname: string) {
  if (pathname.startsWith("/study-abroad/")) {
    const country = pathname.split("/")[2]?.toUpperCase();
    return `Hi Mindmorph, I'm interested in studying in ${country} — can you help?`;
  }
  if (pathname.startsWith("/test-prep/")) {
    const exam = pathname.split("/")[2]?.toUpperCase();
    return `Hi Mindmorph, I'd like to know more about your ${exam} preparation classes.`;
  }
  if (pathname.startsWith("/scholarships")) {
    return "Hi Mindmorph, I'd like help applying for a scholarship.";
  }
  if (pathname.startsWith("/book")) {
    return "Hi Mindmorph, I started a consultation booking but didn't finish.";
  }
  return undefined;
}

export function WhatsAppFloat() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={buildWhatsAppLink(messageFor(pathname))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-30 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center transition-transform hover:scale-105"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.48A11.83 11.83 0 0012.04 0C5.46 0 .12 5.34.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.27-1.64a11.9 11.9 0 005.77 1.47h.01c6.58 0 11.92-5.34 11.92-11.92 0-3.18-1.24-6.17-3.45-8.43zM12.05 21.8h-.01a9.86 9.86 0 01-5.03-1.38l-.36-.21-3.72.97.99-3.62-.23-.37a9.84 9.84 0 01-1.5-5.27c0-5.45 4.43-9.88 9.88-9.88 2.64 0 5.12 1.03 6.98 2.9a9.81 9.81 0 012.9 6.98c0 5.45-4.43 9.88-9.9 9.88zm5.42-7.4c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.19-.24-.57-.49-.5-.66-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46s1.06 2.85 1.21 3.05c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
      </svg>
    </a>
  );
}
