import SectionHeading from "../SectionHeading";
import { CheckIcon } from "../icons";
import { reasons } from "@/lib/content";

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Why 500+ Parents Trust MindMorph"
          subtitle="Not promises — a method. Here is exactly what you get when your child joins."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <article
              key={reason.title}
              className={`card ${i === 0 ? "lg:col-span-2" : ""}`}
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500/15 text-gold-600">
                <CheckIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold">{reason.title}</h3>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-navy-600">{reason.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
