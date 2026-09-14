import Link from "next/link";
import Logo from "./Logo";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./icons";
import { navLinks, site, whatsappLink, whatsappMessages } from "@/lib/site";
import { curricula } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="lg:col-span-1">
          <Logo tone="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-navy-200/80">
            {site.description}
          </p>
          <p className="mt-5 font-display text-sm font-semibold text-gold-400">
            {site.tagline}
          </p>
        </div>

        <nav aria-label="Footer">
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">
            Explore
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-gold-400">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/apply" className="transition-colors hover:text-gold-400">
                Book A Free Assessment
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">
            Curricula
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {curricula.map((item) => (
              <li key={item.number} className="text-navy-200/85">
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">
            Get In Touch
          </h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a
                href={`tel:${site.contact.phoneDial}`}
                className="flex items-start gap-3 transition-colors hover:text-gold-400"
              >
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                {site.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="flex items-start gap-3 break-all transition-colors hover:text-gold-400"
              >
                <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                {site.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
              {site.contact.location}
            </li>
          </ul>

          <a
            href={whatsappLink(whatsappMessages.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-6 w-full sm:w-auto"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        {/* Extra bottom/right room so the floating WhatsApp pill never sits on
            top of this line. */}
        <div className="shell flex flex-col items-center justify-between gap-3 pb-24 pt-6 text-xs text-navy-200/60 sm:flex-row sm:pb-8 sm:pr-56">
          <p>© {year} {site.name}. All rights reserved.</p>
          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
