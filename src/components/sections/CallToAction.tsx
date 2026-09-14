import { PhoneIcon, WhatsAppIcon } from "../icons";
import { site, whatsappLink, whatsappMessages } from "@/lib/site";

export default function CallToAction() {
  return (
    <section className="bg-white pb-20 lg:pb-28">
      <div className="shell">
        <div className="relative overflow-hidden rounded-3xl bg-navy-950 px-7 py-16 text-center sm:px-12 lg:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-gold-500/18 blur-[100px]" />
            <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sky-brand/20 blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-400">
              Free · 30 minutes · No obligation
            </span>

            <h2 className="mt-6 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Ready to Morph Your Mind?
            </h2>

            <p className="mt-5 text-base leading-relaxed text-navy-100/85 sm:text-lg">
              Book a FREE 30-minute assessment and trial class today. We&apos;ll show you exactly
              where your child stands — and exactly how we&apos;ll move them forward.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={whatsappLink(whatsappMessages.trial)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Book Free Trial on WhatsApp
              </a>
              <a href={`tel:${site.contact.phoneDial}`} className="btn-ghost-light">
                <PhoneIcon className="h-5 w-5" />
                Call Us: {site.contact.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
