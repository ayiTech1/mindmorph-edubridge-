import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { destinations } from "@/content/destinations";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata = buildMetadata({
  title: "Study Abroad — 7 destinations, one trusted partner",
  description:
    "Explore study abroad opportunities in the UK, Canada, USA, Australia, Germany, Türkiye, and Malaysia with Mindmorph Edubridge.",
  path: "/study-abroad"
});

export default function StudyAbroadHub() {
  return (
    <>
      <section className="bg-brand-navy text-white py-20 md:py-28">
        <div className="container">
          <p className="uppercase tracking-widest text-xs text-brand-sky">Study Abroad</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            7 destinations. Hundreds of programmes. One trusted partner.
          </h1>
          <p className="mt-5 text-lg text-brand-ice/85 max-w-3xl">
            Choose where you want to go — or talk to a consultant if you&apos;re still deciding.
            We&apos;ve placed students in every country below.
          </p>
        </div>
      </section>

      <Section title="Pick your destination" bg="cream">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((d) => (
            <Link
              key={d.slug}
              href={`/study-abroad/${d.slug}`}
              className="group block bg-white border border-[#C8D8EA] rounded-card shadow-card overflow-hidden hover:shadow-cardHover transition-shadow"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={d.imageUrl}
                  alt={d.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent" />
                <span className="absolute top-3 right-3 text-3xl drop-shadow-lg" aria-hidden="true">{d.flag}</span>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h2 className="text-xl font-semibold">{d.name}</h2>
                  <p className="mt-1 text-xs uppercase tracking-widest text-brand-ice/85">
                    Visa {d.visaSuccessRate}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-brand-charcoal/85">{d.hero}</p>
                <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="uppercase tracking-wider text-brand-slate">Tuition</dt>
                    <dd className="text-brand-charcoal font-medium mt-0.5">{d.tuitionRange}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-wider text-brand-slate">Post-study</dt>
                    <dd className="text-brand-charcoal font-medium mt-0.5 line-clamp-2">{d.postStudyWork}</dd>
                  </div>
                </dl>
                <p className="mt-5 text-sm font-medium text-brand-ocean group-hover:underline">
                  Explore {d.name} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}
