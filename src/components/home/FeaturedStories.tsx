import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { PublicTestimonial } from "@/lib/admin-data";

/**
 * Featured testimonials on the homepage. Accepts the list as a prop so the
 * caller (the home page server component) controls whether to source from
 * the DB or the seed file.
 */
export function FeaturedStories({ stories }: { stories: PublicTestimonial[] }) {
  if (stories.length === 0) return null;

  // Show up to 3 — first prioritising explicitly featured, then chronologically.
  const sorted = [...stories].sort((a, b) => Number(b.featured) - Number(a.featured));
  const display = sorted.slice(0, 3);

  return (
    <Section
      eyebrow="Real students. Real outcomes."
      title="Their journey is the proof."
      description="See how Mindmorph students are studying — and thriving — across the world."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {display.map((t) => (
          <Card key={t.id} as="article">
            <div className="flex items-center gap-4">
              {t.photoUrl ? (
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-brand-ice shrink-0">
                  <Image
                    src={t.photoUrl}
                    alt={`${t.studentName}, Mindmorph student in ${t.destinationCountry}`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center shrink-0">
                  {t.studentName
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
              )}
              <div>
                <Badge tone="sky">{t.destinationCountry}</Badge>
                <p className="mt-1 font-semibold text-brand-navy">{t.studentName}</p>
              </div>
            </div>
            <blockquote className="mt-5 text-brand-charcoal italic">“{t.quote}”</blockquote>
            <div className="mt-5 pt-5 border-t border-[#E6F1FB]">
              <p className="text-sm text-brand-slate">
                {t.programme} — {t.destinationUniversity}
              </p>
              <p className="text-xs text-brand-slate mt-1">From {t.origin}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/success-stories"
          className="inline-flex items-center gap-2 font-medium text-brand-ocean hover:underline"
        >
          See all success stories →
        </Link>
      </div>
    </Section>
  );
}
