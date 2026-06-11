import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { LeadForm } from "@/components/forms/LeadForm";
import { supportTopics } from "@/content/services";

export const metadata = buildMetadata({
  title: "Student Support — Accommodation, Pre-Departure & Arrival",
  description:
    "Vetted accommodation, pre-departure briefings, and arrival logistics so you land ready.",
  path: "/student-support"
});

export default function StudentSupportHub() {
  return (
    <>
      <section className="bg-brand-navy text-white py-20">
        <div className="container">
          <p className="uppercase tracking-widest text-xs text-brand-sky">Student Support</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            We don&apos;t stop at the visa.
          </h1>
          <p className="mt-5 text-lg text-brand-ice/85 max-w-3xl">
            From the moment your visa is approved to your first week of classes, Mindmorph stays
            with you — accommodation, flights, banking, and orientation.
          </p>
        </div>
      </section>

      <Section title="What we cover" eyebrow="Three pillars of support" bg="cream">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {supportTopics.map((t) => (
            <Card key={t.slug} as="article">
              <Link href={`/student-support/${t.slug}`} className="block">
                <h2 className="text-lg font-semibold text-brand-navy">{t.name}</h2>
                <p className="mt-2 text-sm text-brand-charcoal/80">{t.description}</p>
                <p className="mt-4 text-sm font-medium text-brand-ocean">More details →</p>
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Talk to our student support team" bg="ice">
        <div className="max-w-2xl">
          <LeadForm defaultService="Counselling" ctaLabel="Talk to student support" />
        </div>
      </Section>
    </>
  );
}
