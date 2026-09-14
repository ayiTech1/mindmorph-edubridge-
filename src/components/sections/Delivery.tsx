import Image from "next/image";
import SectionHeading from "../SectionHeading";
import { CheckIcon } from "../icons";
import { delivery } from "@/lib/content";
import { images } from "@/lib/images";

export default function Delivery() {
  return (
    <section className="bg-navy-50/60 py-20 lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="How You Learn"
          title="Online or In-Person — Your Choice"
          subtitle="The same tutors, the same curriculum expertise, delivered whichever way suits your family."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {delivery.map((option, i) => {
            const dark = i === 0;
            const photo = dark ? images.online : images.inPerson;
            return (
              <article
                key={option.mode}
                className={`relative overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1 ${
                  dark
                    ? "bg-navy-900 text-white shadow-xl shadow-navy-900/20"
                    : "border border-navy-100 bg-white"
                }`}
              >
                <div className="relative h-56 w-full overflow-hidden sm:h-64">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    sizes="(max-width: 1024px) 92vw, 34rem"
                    placeholder="blur"
                    className="h-full w-full object-cover"
                  />
                  <div
                    aria-hidden
                    className={`absolute inset-0 bg-gradient-to-t ${
                      dark ? "from-navy-900" : "from-white"
                    } via-transparent to-transparent`}
                  />
                </div>

                <span
                  aria-hidden
                  className={`absolute -right-16 top-52 h-52 w-52 rounded-full blur-2xl ${
                    dark ? "bg-sky-brand/20" : "bg-gold-500/12"
                  }`}
                />
                <div className="relative p-8 pt-6 sm:p-10 sm:pt-7">
                  <p
                    className={`text-xs font-bold uppercase tracking-[0.18em] ${
                      dark ? "text-gold-400" : "text-navy-400"
                    }`}
                  >
                    {dark ? "Option 01" : "Option 02"}
                  </p>
                  <h3
                    className={`mt-3 font-display text-2xl font-extrabold ${
                      dark ? "text-white" : "text-navy-900"
                    }`}
                  >
                    {option.mode}
                  </h3>
                  <p
                    className={`mt-1.5 font-display text-base font-semibold ${
                      dark ? "text-navy-100/70" : "text-navy-500"
                    }`}
                  >
                    {option.strap}
                  </p>

                  <ul className="mt-7 space-y-3.5">
                    {option.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                            dark ? "bg-gold-500 text-navy-900" : "bg-navy-900 text-white"
                          }`}
                        >
                          <CheckIcon className="h-3 w-3" />
                        </span>
                        <span
                          className={`text-[0.95rem] leading-relaxed ${
                            dark ? "text-navy-100/85" : "text-navy-600"
                          }`}
                        >
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
