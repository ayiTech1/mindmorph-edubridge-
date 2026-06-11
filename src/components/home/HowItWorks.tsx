import { Section } from "@/components/ui/Section";

const steps = [
  {
    number: "01",
    title: "Book a free consultation",
    description: "30 minutes with a specialist consultant — by video, phone, or at our Accra office."
  },
  {
    number: "02",
    title: "Get your personalised plan",
    description: "A clear roadmap: university shortlist, test prep timeline, scholarship targets, and visa milestones."
  },
  {
    number: "03",
    title: "We guide you all the way",
    description: "From IELTS to airport pick-up — Mindmorph stays with you until you're enrolled and settled."
  }
];

export function HowItWorks() {
  return (
    <Section
      eyebrow="How it works"
      title="Three simple steps. One global journey."
      bg="ice"
    >
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <li key={s.number} className="relative bg-white rounded-card border border-[#C8D8EA] p-7 shadow-card">
            <p className="text-5xl font-bold text-brand-sky/60">{s.number}</p>
            <h3 className="mt-3 text-lg font-semibold text-brand-navy">{s.title}</h3>
            <p className="mt-2 text-brand-charcoal/80 text-sm">{s.description}</p>
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-brand-sky/40"
              />
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
