import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LeadForm } from "@/components/forms/LeadForm";
import { ClassSchedule } from "@/components/test-prep/ClassSchedule";
import { exams, examBySlug } from "@/content/exams";

export async function generateStaticParams() {
  return exams.map((e) => ({ exam: e.slug }));
}

export async function generateMetadata({ params }: { params: { exam: string } }) {
  const exam = examBySlug(params.exam);
  if (!exam) return {};
  return buildMetadata({
    title: `${exam.name} preparation in Ghana & Nigeria`,
    description: exam.blurb,
    path: `/test-prep/${exam.slug}`
  });
}

export default function ExamPage({ params }: { params: { exam: string } }) {
  const exam = examBySlug(params.exam);
  if (!exam) return notFound();

  return (
    <>
      <section className="bg-brand-navy text-white py-20">
        <div className="container">
          <p className="text-sm uppercase tracking-widest text-brand-sky">Test Prep</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            {exam.name} preparation
          </h1>
          <p className="mt-5 text-lg text-brand-ice/85 max-w-3xl">{exam.blurb}</p>
          {exam.scoreGuarantee && (
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-brand-teal bg-white/10 rounded-pill px-3 py-1">
              ✓ {exam.scoreGuarantee}
            </p>
          )}
        </div>
      </section>

      <Section title="Course at a glance" bg="cream">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card><p className="text-xs uppercase tracking-wider text-brand-slate">Duration</p><p className="mt-2 font-semibold text-brand-navy">{exam.duration}</p></Card>
          <Card><p className="text-xs uppercase tracking-wider text-brand-slate">Price range</p><p className="mt-2 font-semibold text-brand-navy">{exam.priceRange}</p></Card>
          <Card><p className="text-xs uppercase tracking-wider text-brand-slate">Formats</p><p className="mt-2 font-semibold text-brand-navy">{exam.formats.join(" · ")}</p></Card>
        </div>
      </Section>

      <Section
        eyebrow="What's included"
        title={`Inside the Mindmorph ${exam.name} course.`}
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Personalised diagnostic test on day one",
            "Weekly graded practice sessions with written feedback",
            "Section-by-section strategy clinics",
            "2 full-length mock tests at exam conditions",
            "Vocabulary, grammar and writing intensives",
            "Direct WhatsApp access to your instructor"
          ].map((line) => (
            <li key={line} className="flex items-start gap-3 bg-white border border-[#E6F1FB] rounded-card p-4">
              <span className="text-brand-teal mt-1">✓</span>
              <span className="text-sm text-brand-charcoal">{line}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Upcoming cohorts"
        title={`${exam.name} class schedule`}
        bg="ice"
      >
        <ClassSchedule examFilter={exam.name} />
      </Section>

      <Section
        eyebrow="Next intake"
        title="Reserve your seat."
        description="Tell us your target score and preferred format. We'll WhatsApp you the next cohort details."
      >
        <div className="max-w-2xl">
          <Badge tone="amber" className="mb-3">Limited seats per cohort</Badge>
          <LeadForm defaultService="Test Prep" ctaLabel={`Reserve my ${exam.name} seat`} />
        </div>
      </Section>
    </>
  );
}
