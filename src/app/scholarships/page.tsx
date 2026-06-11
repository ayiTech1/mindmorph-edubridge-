import { Section } from "@/components/ui/Section";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import {
  ScholarshipsList,
  type PublicScholarship
} from "@/components/scholarships/ScholarshipsList";
import { buildMetadata } from "@/lib/seo";
import { getLiveScholarshipsForPublic } from "@/lib/admin-data";
import { scholarships as seedScholarships } from "@/content/scholarships";
import { formatDate } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Scholarships — Fully-funded awards for West African students",
  description:
    "Live database of fully-funded scholarships open to Ghanaian, Nigerian, and Ivorian students.",
  path: "/scholarships"
});

// Revalidate every hour. The scholarship server actions also call
// revalidatePath("/scholarships") so admin publishes appear immediately.
export const revalidate = 3600;

function fromSeed(): PublicScholarship[] {
  const now = Date.now();
  return seedScholarships
    .filter((s) => new Date(s.deadline).getTime() >= now)
    .sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline))
    .map((s) => ({
      id: s.id,
      name: s.name,
      destination: s.destination,
      level: s.level,
      awardValue: s.awardValue,
      deadline: s.deadline,
      deadlineLabel: formatDate(s.deadline),
      eligibility: s.eligibility,
      link: s.link ?? ""
    }));
}

export default async function ScholarshipsPage() {
  const dbRows = await getLiveScholarshipsForPublic();
  const list: PublicScholarship[] = dbRows.length > 0 ? dbRows : fromSeed();

  return (
    <>
      <section className="bg-brand-navy text-white py-20">
        <div className="container">
          <p className="uppercase tracking-widest text-xs text-brand-sky">Scholarships</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Fully-funded scholarships open to West African students.
          </h1>
          <p className="mt-5 text-lg text-brand-ice/85 max-w-3xl">
            Updated monthly. Filter by destination and level. We help shortlisted applicants from
            essay to interview.
          </p>
        </div>
      </section>

      <Section bg="cream">
        <ScholarshipsList scholarships={list} />
      </Section>

      <Section
        bg="ice"
        eyebrow="Be first to know"
        title="Get an alert when new scholarships open."
      >
        <div className="max-w-xl">
          <NewsletterForm segment="scholarships" />
        </div>
      </Section>
    </>
  );
}
