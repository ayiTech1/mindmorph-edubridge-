import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { destinations } from "@/content/destinations";

export function DestinationGrid() {
  return (
    <Section
      eyebrow="Where will you go?"
      title="7 destinations. One trusted partner."
      description="Each Mindmorph student is matched to the destination, university, and programme that fit their goals — not just the easiest sale."
      bg="cream"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {destinations.map((d) => (
          <Link
            key={d.slug}
            href={`/study-abroad/${d.slug}`}
            className="group relative block overflow-hidden rounded-card border border-[#C8D8EA] shadow-card hover:shadow-cardHover transition-shadow"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={d.imageUrl}
                alt={d.imageAlt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/30 to-transparent" />
              <span className="absolute top-3 right-3 text-2xl drop-shadow-lg" aria-hidden="true">
                {d.flag}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-[11px] uppercase tracking-widest text-brand-ice/85">
                  Visa {d.visaSuccessRate}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{d.name}</h3>
              </div>
            </div>
            <div className="bg-white p-4">
              <p className="text-sm text-brand-charcoal/85 line-clamp-2">{d.tagline}</p>
              <p className="mt-3 text-xs font-medium text-brand-ocean group-hover:underline">
                Explore {d.name} →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
