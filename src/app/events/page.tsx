import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { events } from "@/content/events";
import { formatDate } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Events & Webinars",
  description: "University fairs, info sessions, and free diagnostic days across West Africa.",
  path: "/events"
});

export default function EventsPage() {
  const now = Date.now();
  const upcoming = events
    .filter((e) => new Date(e.endsAt ?? e.startsAt).getTime() >= now)
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));

  return (
    <>
      <section className="bg-brand-navy text-white py-20">
        <div className="container">
          <p className="uppercase tracking-widest text-xs text-brand-sky">Events</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Meet us. Online and in your city.
          </h1>
          <p className="mt-5 text-lg text-brand-ice/85 max-w-3xl">
            University fairs, country info sessions, free IELTS diagnostic days. Most events are free.
          </p>
        </div>
      </section>

      <Section bg="cream" title="Upcoming events">
        {upcoming.length === 0 ? (
          <p className="text-brand-slate">No upcoming events listed right now — check back soon or follow us on socials.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {upcoming.map((e) => (
              <li key={e.slug}>
                <Card as="article">
                  <Link href={`/events/${e.slug}`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <Badge tone={e.format === "online" ? "sky" : "teal"}>{e.format}</Badge>
                      <span className="text-xs text-brand-slate">{formatDate(e.startsAt)}</span>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-brand-navy">{e.title}</h2>
                    <p className="mt-2 text-sm text-brand-charcoal/80 line-clamp-3">{e.description}</p>
                    {e.location && <p className="mt-3 text-xs text-brand-slate">📍 {e.location}</p>}
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
