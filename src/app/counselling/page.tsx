import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { LeadForm } from "@/components/forms/LeadForm";
import { counsellingTopics } from "@/content/services";

export const metadata = buildMetadata({
  title: "Career & Academic Counselling",
  description:
    "1-on-1 counselling for students, professionals, and parents — career discovery, gap year planning, HND-to-degree advice.",
  path: "/counselling"
});

export default function CounsellingHub() {
  return (
    <>
      <section className="bg-brand-navy text-white py-20">
        <div className="container">
          <p className="uppercase tracking-widest text-xs text-brand-sky">Counselling</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Clarity, not just advice.
          </h1>
          <p className="mt-5 text-lg text-brand-ice/85 max-w-3xl">
            Whether you&apos;re a 17-year-old WASSCE graduate or a 35-year-old professional considering an MBA,
            our counsellors meet you where you are.
          </p>
        </div>
      </section>

      <Section bg="cream" title="What we counsel on" eyebrow="Areas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {counsellingTopics.map((t) => (
            <Card key={t.slug} as="article">
              <Link href={`/counselling/${t.slug}`} className="block">
                <h2 className="text-xl font-semibold text-brand-navy">{t.name}</h2>
                <p className="mt-2 text-sm text-brand-charcoal/80">{t.description}</p>
                <p className="mt-4 text-sm font-medium text-brand-ocean">Learn more →</p>
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Book a counselling session" bg="ice">
        <div className="max-w-2xl">
          <LeadForm defaultService="Counselling" />
        </div>
      </Section>
    </>
  );
}
