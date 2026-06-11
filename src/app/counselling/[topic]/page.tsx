import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { LeadForm } from "@/components/forms/LeadForm";
import { counsellingTopics } from "@/content/services";

export async function generateStaticParams() {
  return counsellingTopics.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: { params: { topic: string } }) {
  const topic = counsellingTopics.find((t) => t.slug === params.topic);
  if (!topic) return {};
  return buildMetadata({
    title: `${topic.name} | Counselling`,
    description: topic.description,
    path: `/counselling/${topic.slug}`
  });
}

export default function CounsellingTopicPage({ params }: { params: { topic: string } }) {
  const topic = counsellingTopics.find((t) => t.slug === params.topic);
  if (!topic) return notFound();

  return (
    <>
      <section className="bg-brand-navy text-white py-20">
        <div className="container">
          <p className="uppercase tracking-widest text-xs text-brand-sky">Counselling</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">{topic.name}</h1>
          <p className="mt-5 text-lg text-brand-ice/85 max-w-3xl">{topic.description}</p>
        </div>
      </section>

      <Section title="What you'll get" bg="cream">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "60-minute structured session with a senior counsellor",
            "A written summary and 90-day action plan",
            "Personalised reading list and resource pack",
            "Follow-up WhatsApp support for 4 weeks"
          ].map((line) => (
            <li key={line} className="flex items-start gap-3 bg-white border border-[#E6F1FB] rounded-card p-4">
              <span className="text-brand-teal mt-1">✓</span>
              <span className="text-sm text-brand-charcoal">{line}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Book your session" bg="ice">
        <div className="max-w-2xl">
          <LeadForm defaultService="Counselling" />
        </div>
      </Section>
    </>
  );
}
