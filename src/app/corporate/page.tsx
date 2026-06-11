import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { LeadForm } from "@/components/forms/LeadForm";
import { corporateTopics } from "@/content/services";

export const metadata = buildMetadata({
  title: "Corporate Training & Institutional Partnerships",
  description: "Bespoke upskilling, twin-degrees, and embedded school counselling.",
  path: "/corporate"
});

export default function CorporateHub() {
  return (
    <>
      <section className="bg-brand-navy text-white py-20">
        <div className="container">
          <p className="uppercase tracking-widest text-xs text-brand-sky">Corporate</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Education partnerships that move organisations forward.
          </h1>
          <p className="mt-5 text-lg text-brand-ice/85 max-w-3xl">
            For schools, polytechnics, banks, NGOs, and government agencies — Mindmorph designs and
            delivers learning programmes that work.
          </p>
        </div>
      </section>

      <Section title="How we work with institutions" eyebrow="Three engagement models" bg="cream">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {corporateTopics.map((t) => (
            <Card key={t.slug} as="article">
              <Link href={`/corporate/${t.slug}`} className="block">
                <h2 className="text-lg font-semibold text-brand-navy">{t.name}</h2>
                <p className="mt-2 text-sm text-brand-charcoal/80">{t.description}</p>
                <p className="mt-4 text-sm font-medium text-brand-ocean">Read more →</p>
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Request a proposal" bg="ice">
        <div className="max-w-2xl">
          <LeadForm defaultService="Corporate Training" ctaLabel="Request a proposal" />
        </div>
      </Section>
    </>
  );
}
