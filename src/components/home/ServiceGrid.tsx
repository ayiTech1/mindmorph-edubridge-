import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { services } from "@/content/services";

export function ServiceGrid() {
  return (
    <Section
      eyebrow="What we do"
      title="Everything you need to study abroad — in one place."
      description="From your first WhatsApp message to your arrival at the airport, Mindmorph stays with you."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s) => (
          <Card key={s.slug} as="article" className="group relative overflow-hidden">
            <Link href={s.href} className="block">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-navy to-brand-ocean text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ServiceIcon name={s.icon} />
              </div>
              <h3 className="text-lg font-semibold text-brand-navy">{s.name}</h3>
              <p className="mt-2 text-sm text-brand-charcoal/80">{s.description}</p>
              <p className="mt-4 text-sm font-medium text-brand-ocean group-hover:underline">
                Learn more →
              </p>
            </Link>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function ServiceIcon({ name }: { name: string }) {
  // Lightweight inline SVGs — no icon library dependency.
  const paths: Record<string, React.ReactNode> = {
    graduation: <path d="M3 9l9-5 9 5-9 5-9-5zm0 0v6m18-6v6M7 12v4c0 1.5 2 3 5 3s5-1.5 5-3v-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    book: <path d="M4 5a2 2 0 012-2h12v17H6a2 2 0 01-2-2V5zm14 0v15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    compass: <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M15 9l-2 6-6 2 2-6 6-2z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" /></>,
    building: <path d="M4 21V5a2 2 0 012-2h12a2 2 0 012 2v16M9 9h2m2 0h2M9 13h2m2 0h2M9 17h6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />,
    heart: <path d="M12 21s-7-4.5-7-11a4 4 0 017-2.6A4 4 0 0119 10c0 6.5-7 11-7 11z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />,
    lightbulb: <path d="M9 18h6m-5 3h4M12 3a6 6 0 00-4 10.5c.7.7 1 1.6 1 2.5h6c0-.9.3-1.8 1-2.5A6 6 0 0012 3z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
  };
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
