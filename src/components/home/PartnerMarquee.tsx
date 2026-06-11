import { Container } from "@/components/ui/Container";
import { partners } from "@/content/partners";

export function PartnerMarquee() {
  // Render the list twice so the CSS marquee animation can loop seamlessly.
  const doubled = [...partners, ...partners];

  return (
    <div className="py-14 bg-white border-y border-[#E6F1FB] overflow-hidden">
      <Container>
        <p className="text-center text-xs uppercase tracking-widest text-brand-slate mb-6">
          Our students have been placed at
        </p>
      </Container>
      <div className="relative">
        <div className="flex gap-10 whitespace-nowrap animate-marquee">
          {doubled.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              className="shrink-0 inline-flex items-center justify-center min-w-[14rem] h-12 rounded-card border border-[#E6F1FB] bg-brand-cream px-6"
            >
              <span className="text-sm font-medium text-brand-navy">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
