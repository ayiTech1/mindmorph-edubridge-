import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LeadForm } from "@/components/forms/LeadForm";
import { ClassSchedule } from "@/components/test-prep/ClassSchedule";
import { exams } from "@/content/exams";

export const metadata = buildMetadata({
  title: "Test Preparation — IELTS, TOEFL, GRE, GMAT, SAT, PTE, WASSCE",
  description:
    "In-person Accra & Lagos, online live, and self-paced courses. Score improvement guarantee.",
  path: "/test-prep",
  keywords: [
    "IELTS preparation Accra",
    "GMAT coaching Ghana",
    "WASSCE resit classes",
    "online TOEFL prep West Africa"
  ]
});

export default function TestPrepHub() {
  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <div className="absolute inset-0 -z-20">
          <Image
            src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=2000&h=1000&q=80"
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
          <p className="text-sm uppercase tracking-widest text-brand-sky">Test Prep</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Score higher. Apply with confidence.
          </h1>
          <p className="mt-5 text-lg text-brand-ice/90 max-w-3xl">
            British Council-certified instructors. Score improvement guarantee. Classes in Accra,
            Lagos, online live, and self-paced.
          </p>
        </div>
      </section>

      <Section title="Choose your exam" eyebrow="What are you preparing for?" bg="cream">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((e) => (
            <Card key={e.slug} as="article">
              <Link href={`/test-prep/${e.slug}`} className="block">
                <Badge tone="sky">{e.category}</Badge>
                <h2 className="mt-3 text-xl font-semibold text-brand-navy">{e.name}</h2>
                <p className="mt-2 text-sm text-brand-charcoal/80">{e.blurb}</p>
                <p className="mt-4 text-xs text-brand-slate uppercase tracking-wider">
                  {e.duration} · {e.priceRange}
                </p>
                <p className="mt-3 text-sm font-medium text-brand-ocean">Course details →</p>
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Upcoming cohorts"
        title="Live class schedule"
        description="Filter by exam and format. Seats update in real time."
        bg="ice"
      >
        <ClassSchedule />
      </Section>

      <Section
        eyebrow="Why Mindmorph"
        title="Test prep that actually moves your score."
      >
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { h: "Score improvement guarantee", p: "If you don't hit your target band, retake the next cohort for free." },
            { h: "Certified instructors", p: "British Council IELTS examiners and ETS-trained TOEFL teachers." },
            { h: "Flexible formats", p: "Live in Accra & Lagos, online live, or self-paced — your call." }
          ].map((b) => (
            <li key={b.h} className="bg-white border border-[#E6F1FB] rounded-card p-6">
              <h3 className="font-semibold text-brand-navy">{b.h}</h3>
              <p className="mt-2 text-sm text-brand-charcoal/80">{b.p}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Free diagnostic"
        title="Book your free 30-minute diagnostic."
        description="Know exactly where you stand — and what it will take to hit your target band."
        bg="ice"
      >
        <div className="max-w-2xl">
          <LeadForm defaultService="Test Prep" ctaLabel="Book my free diagnostic" />
        </div>
      </Section>
    </>
  );
}
