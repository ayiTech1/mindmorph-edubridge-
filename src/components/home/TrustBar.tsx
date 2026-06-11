import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

const items = [
  { value: `${siteConfig.stats.studentsPlaced}+`, label: "Students placed" },
  { value: `${siteConfig.stats.partnerUniversities}+`, label: "Partner universities" },
  { value: siteConfig.stats.countriesServed, label: "Countries served" },
  { value: siteConfig.stats.yearsOperating, label: "Years operating" },
  { value: siteConfig.stats.visaSuccessRate, label: "Visa success rate" }
];

export function TrustBar() {
  return (
    <div className="bg-white border-y border-[#E6F1FB]">
      <Container className="py-8">
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {items.map((item) => (
            <li key={item.label}>
              <p className="text-2xl md:text-3xl font-bold text-brand-navy">{item.value}</p>
              <p className="text-xs md:text-sm uppercase tracking-wider text-brand-slate mt-1">
                {item.label}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
