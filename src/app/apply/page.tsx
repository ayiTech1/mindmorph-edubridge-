import type { Metadata } from "next";
import ApplicationForm from "@/components/ApplicationForm";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { site, whatsappLink, whatsappMessages } from "@/lib/site";
import { steps } from "@/lib/content";

export const metadata: Metadata = {
  title: "Book A Free Assessment",
  description:
    "Book a free 30-minute assessment and trial class with MindMorph EduBridge. No obligation — apply online or on WhatsApp.",
};

export default function ApplyPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-950 pt-[72px] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-sky-brand/15 blur-[110px]" />
          <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-gold-500/12 blur-[110px]" />
        </div>

        <div className="shell relative py-16 text-center lg:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-400">
            Free · 30 minutes · No obligation
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Book Your Free Assessment
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-navy-100/85 sm:text-lg">
            Tell us a little about the learner and we&apos;ll match them with the right tutor for
            their curriculum. It takes about two minutes.
          </p>

          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-navy-100/75">
            {steps.map((step) => (
              <li key={step.title} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 shrink-0 text-gold-500" />
                {step.title}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-navy-50/60 py-16 lg:py-20">
        <div className="shell grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
          <ApplicationForm />

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-whatsapp/25 bg-whatsapp/5 p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-whatsapp text-white">
                <WhatsAppIcon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-base font-bold">Prefer to chat?</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
                Message us on WhatsApp and a real tutor will reply — usually within minutes.
              </p>
              <a
                href={whatsappLink(whatsappMessages.trial)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp mt-5 w-full"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="rounded-2xl border border-navy-100 bg-white p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-900 text-gold-400">
                <PhoneIcon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-base font-bold">Rather speak to someone?</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
                Call us during working hours and we&apos;ll take your details over the phone.
              </p>
              <a href={`tel:${site.contact.phoneDial}`} className="btn-outline mt-5 w-full">
                {site.contact.phoneDisplay}
              </a>
            </div>

            <div className="rounded-2xl bg-navy-900 p-6 text-white">
              <h2 className="font-display text-base font-bold text-white">What happens next</h2>
              <ol className="mt-4 space-y-3.5">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex gap-3 text-sm">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-gold-500 font-display text-xs font-bold text-navy-900">
                      {i + 1}
                    </span>
                    <span className="text-navy-100/85">{step.body}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
