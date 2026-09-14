"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./icons";
import { whatsappLink, whatsappMessages } from "@/lib/site";

/**
 * Persistent WhatsApp entry point. Appears once the hero is scrolled past so it
 * never competes with the hero's own two calls to action.
 */
export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={whatsappLink(whatsappMessages.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MindMorph EduBridge on WhatsApp"
      className={`group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-whatsapp py-3.5 pl-4 pr-5 text-white shadow-2xl shadow-whatsapp/40 transition-all duration-300 hover:bg-whatsapp-dark ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40 [animation-duration:2.6s]" />
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden text-sm font-semibold sm:inline">Chat with us</span>
    </a>
  );
}
