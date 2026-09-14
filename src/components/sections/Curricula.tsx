import Link from "next/link";
import SectionHeading from "../SectionHeading";
import { ArrowIcon } from "../icons";
import { curricula } from "@/lib/content";

export default function Curricula() {
  return (
    <section id="curricula" className="relative overflow-hidden bg-navy-900 py-20 text-white lg:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-sky-brand/12 blur-[120px]" />
      </div>

      <div className="shell relative">
        <SectionHeading
          eyebrow="Our Specializations"
          title="Experts in International Curricula"
          subtitle="We don't teach general tuition. We specialize in internationally recognized systems — and we know how each one is marked."
          tone="light"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {curricula.map((item) => (
            <article
              key={item.number}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:bg-white/[0.07]"
            >
              <span className="font-display text-4xl font-extrabold text-white/10 transition-colors duration-300 group-hover:text-gold-500/35">
                {item.number}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-navy-100/70">{item.body}</p>
              <span
                aria-hidden
                className="absolute inset-x-7 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-gold-500 to-transparent transition-transform duration-500 group-hover:scale-x-100"
              />
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-7 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-navy-100/80">
            …and other related international courses. If your exam board isn&apos;t listed, we very
            likely still cover it.
          </p>
          <Link href="/apply" className="btn-gold shrink-0">
            Ask About Your Curriculum
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
