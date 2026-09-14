import SectionHeading from "../SectionHeading";
import { levelIcons } from "../icons";
import { levels } from "@/lib/content";

export default function Programs() {
  return (
    <section id="programs" className="bg-navy-50/60 py-20 lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Who We Teach"
          title="Tuition For Every Level"
          subtitle="From a child finding their feet in Grade 1 to an adult sitting a professional qualification — there is a MindMorph programme for it."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {levels.map((level, i) => {
            const Icon = levelIcons[level.icon];
            return (
              <article key={level.title} className="card group relative overflow-hidden">
                <span
                  aria-hidden
                  className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gold-500/10 transition-transform duration-500 group-hover:scale-150"
                />
                <div className="relative">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-900 p-3.5 text-gold-400 shadow-lg shadow-navy-900/20">
                    {Icon ? <Icon /> : null}
                  </div>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-navy-400">
                    0{i + 1}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold">{level.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-navy-600">{level.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
