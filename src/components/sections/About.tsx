import Image from "next/image";
import SectionHeading from "../SectionHeading";
import { about } from "@/lib/content";
import { images } from "@/lib/images";

export default function About() {
  return (
    <section id="about" className="bg-white py-20 lg:py-28">
      <div className="shell grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="About Us"
            title={about.headline}
            align="left"
          />
          <div className="mt-6 space-y-5 text-base leading-relaxed text-navy-600">
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border-l-4 border-gold-500 bg-navy-50 p-6">
            <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-navy-600">
              Our Mission
            </p>
            <p className="mt-2 text-base leading-relaxed text-navy-800">{about.mission}</p>
          </div>
        </div>

        <div>
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src={images.studying.src}
              alt={images.studying.alt}
              sizes="(max-width: 1024px) 92vw, 34rem"
              placeholder="blur"
              className="h-72 w-full object-cover sm:h-80"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent"
            />
            <p className="absolute bottom-5 left-6 right-6 font-display text-sm font-semibold text-white/95">
              Every plan starts with a diagnostic — never a guess.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5">
            {about.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 ${
                  i % 3 === 0
                    ? "bg-navy-900 text-white"
                    : "border border-navy-100 bg-navy-50 text-navy-900"
                }`}
              >
                <p
                  className={`font-display text-2xl font-extrabold sm:text-3xl ${
                    i % 3 === 0 ? "text-gold-400" : "text-navy-900"
                  }`}
                >
                  {stat.value}
                </p>
                <p
                  className={`mt-1.5 text-sm font-medium ${
                    i % 3 === 0 ? "text-navy-100/75" : "text-navy-600"
                  }`}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
