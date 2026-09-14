import Link from "next/link";
import SectionHeading from "../SectionHeading";
import { ArrowIcon } from "../icons";
import { steps } from "@/lib/content";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-navy-50/60 py-20 lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="How It Works"
          title="Start in 3 Easy Steps"
          subtitle="No forms to chase, no commitment up front. From first contact to first class is usually the same week."
        />

        <div className="relative mt-14">
          {/* Connector, drawn only where the three cards actually sit in a row. */}
          <div
            aria-hidden
            className="absolute inset-x-[16%] top-11 hidden h-0.5 bg-gradient-to-r from-navy-200 via-gold-500/60 to-navy-200 md:block"
          />

          <ol className="relative grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="text-center">
                <div className="mx-auto grid h-[5.5rem] w-[5.5rem] place-items-center rounded-full border-4 border-navy-50 bg-navy-900 font-display text-2xl font-extrabold text-gold-400 shadow-lg shadow-navy-900/20">
                  {i + 1}
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-gold-600">
                  {step.step}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold">{step.title}</h3>
                <p className="mx-auto mt-2.5 max-w-xs text-[0.95rem] leading-relaxed text-navy-600">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 text-center">
          <Link href="/apply" className="btn-primary">
            Book My Free Assessment
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
