import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { StoriesGrid } from "@/components/testimonials/StoriesGrid";
import { buildMetadata } from "@/lib/seo";
import { getPublicTestimonials, type PublicTestimonial } from "@/lib/admin-data";
import { testimonials as seedTestimonials } from "@/content/testimonials";

export const metadata = buildMetadata({
  title: "Success Stories — Mindmorph students worldwide",
  description:
    "Real Mindmorph students placed at universities in the UK, Canada, USA, Australia, Germany, Türkiye, and Malaysia.",
  path: "/success-stories"
});

// ISR — refresh every hour, plus server actions push fresh data on edit.
export const revalidate = 3600;

function fromSeed(): PublicTestimonial[] {
  return seedTestimonials.map((t) => ({
    id: t.id,
    studentName: t.studentName,
    origin: t.origin,
    destinationCountry: t.destinationCountry,
    destinationUniversity: t.destinationUniversity,
    programme: t.programme,
    quote: t.quote,
    fullStory: t.fullStory ?? "",
    photoUrl: t.photoUrl,
    videoUrl: t.videoUrl ?? "",
    serviceType: t.serviceType,
    year: t.year,
    featured: Boolean(t.featured)
  }));
}

export default async function SuccessStoriesPage() {
  const dbRows = await getPublicTestimonials();
  const stories = dbRows.length > 0 ? dbRows : fromSeed();

  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <div className="absolute inset-0 -z-20">
          <Image
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&h=1000&q=80"
            alt=""
            role="presentation"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-navy/95 via-brand-navy/85 to-brand-ocean/75" />
        <div className="container relative py-24">
          <p className="uppercase tracking-widest text-xs text-brand-sky">Success Stories</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white max-w-4xl">
            198 students placed. 94% visa approval rate. 7 destination countries.
          </h1>
          <p className="mt-5 text-lg text-brand-ice/90 max-w-3xl">
            Every story below is a real Mindmorph student — name, course, and outcome.
          </p>
        </div>
      </section>

      <Section bg="cream" eyebrow="Filter stories" title="Find a story that resembles yours.">
        <StoriesGrid stories={stories} />
      </Section>
    </>
  );
}
