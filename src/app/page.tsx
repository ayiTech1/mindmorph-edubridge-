import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { DestinationGrid } from "@/components/home/DestinationGrid";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedStories } from "@/components/home/FeaturedStories";
import { PartnerMarquee } from "@/components/home/PartnerMarquee";
import { LatestResources } from "@/components/home/LatestResources";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getPublicTestimonials, type PublicTestimonial } from "@/lib/admin-data";
import { testimonials as seedTestimonials } from "@/content/testimonials";

export const metadata = buildMetadata({
  title: "Study Abroad Consultancy in Ghana & West Africa",
  description:
    "Mindmorph Edubridge — admissions, test prep, visas, and scholarships for West African students. UK, Canada, USA, Australia, Germany, Türkiye, Malaysia.",
  keywords: [
    "education consultancy Ghana",
    "study abroad from Ghana",
    "overseas education West Africa",
    "study abroad Nigeria",
    "UK university application Ghana"
  ]
});

// ISR — refresh featured stories hourly; server actions push fresh data on edit.
export const revalidate = 3600;

function featuredFromSeed(): PublicTestimonial[] {
  return seedTestimonials
    .filter((t) => t.featured)
    .map((t) => ({
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
      featured: true
    }));
}

export default async function HomePage() {
  const dbRows = await getPublicTestimonials();
  const featured =
    dbRows.length > 0 ? dbRows.filter((t) => t.featured) : featuredFromSeed();
  // If no rows are marked featured in the DB yet, fall back to the most recent.
  const stories = featured.length > 0 ? featured : dbRows.slice(0, 3);

  return (
    <>
      <Hero />
      <TrustBar />
      <DestinationGrid />
      <ServiceGrid />
      <HowItWorks />
      <FeaturedStories stories={stories.length > 0 ? stories : featuredFromSeed()} />
      <PartnerMarquee />
      <LatestResources />
      <FinalCTA />
    </>
  );
}
