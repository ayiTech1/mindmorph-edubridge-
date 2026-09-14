"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { WhatsAppIcon } from "./icons";
import { navLinks, site, whatsappLink, whatsappMessages } from "@/lib/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A menu left open behind a locked body is the classic mobile-nav bug.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      /* Solid white rather than translucent: the header sits over a navy hero,
         and a see-through bar turned the wordmark grey-on-grey. */
      className={`fixed inset-x-0 top-0 z-50 border-b bg-white transition-shadow duration-300 ${
        scrolled || open ? "border-navy-100 shadow-md shadow-navy-900/5" : "border-navy-100/70"
      }`}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-[0.9rem] font-medium text-navy-600 transition-colors hover:bg-navy-50 hover:text-navy-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Link href="/apply" className="btn-outline px-5 py-2.5">
            Book A Free Assessment
          </Link>
          <a
            href={whatsappLink(whatsappMessages.trial)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp px-5 py-2.5"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Book Free Trial
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-11 w-11 place-items-center rounded-xl border border-navy-200 text-navy-800 transition-colors hover:bg-navy-50 lg:hidden"
        >
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? "top-[7px] rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? "top-[7px] -rotate-45" : "top-[14px]"}`} />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-navy-100 bg-white lg:hidden"
      >
        <div className="shell flex flex-col gap-1 py-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-navy-700 transition-colors hover:bg-navy-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2.5">
            <Link href="/apply" onClick={() => setOpen(false)} className="btn-primary w-full">
              Book A Free Assessment
            </Link>
            <a
              href={whatsappLink(whatsappMessages.trial)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="btn-whatsapp w-full"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <a href={`tel:${site.contact.phoneDial}`} className="btn-outline w-full">
              Call {site.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
