import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { LeadForm } from "@/components/forms/LeadForm";
import { events, eventBySlug } from "@/content/events";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export async function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const e = eventBySlug(params.slug);
  if (!e) return {};
  return buildMetadata({ title: e.title, description: e.description, path: `/events/${e.slug}` });
}

export default function EventPage({ params }: { params: { slug: string } }) {
  const event = eventBySlug(params.slug);
  if (!event) return notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.title,
            startDate: event.startsAt,
            endDate: event.endsAt,
            eventAttendanceMode:
              event.format === "online"
                ? "https://schema.org/OnlineEventAttendanceMode"
                : "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location:
              event.format === "online"
                ? { "@type": "VirtualLocation", url: siteConfig.url }
                : { "@type": "Place", name: event.location, address: event.location },
            organizer: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url }
          })
        }}
      />

      <section className="bg-brand-navy text-white py-20">
        <div className="container">
          <Badge tone={event.format === "online" ? "sky" : "teal"}>{event.format}</Badge>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">{event.title}</h1>
          <p className="mt-5 text-lg text-brand-ice/85 max-w-3xl">{event.description}</p>
          <p className="mt-4 text-sm text-brand-ice/70">
            {formatDate(event.startsAt)}{event.endsAt && ` – ${formatDate(event.endsAt)}`}
            {event.location && ` · ${event.location}`}
          </p>
        </div>
      </section>

      <Section bg="cream" title="Register your interest">
        <div className="max-w-2xl">
          <LeadForm defaultService="Counselling" ctaLabel="Register for this event" />
        </div>
      </Section>
    </>
  );
}
