import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { CostCalculator } from "@/components/calculator/CostCalculator";

export const metadata = buildMetadata({
  title: "Cost & Destination Calculator",
  description:
    "Estimate the total cost of studying abroad — tuition, living, and Mindmorph services.",
  path: "/cost-calculator"
});

export default function CostCalculatorPage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-20">
        <div className="container">
          <p className="uppercase tracking-widest text-xs text-brand-sky">Free tool</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Cost & destination calculator
          </h1>
          <p className="mt-5 text-lg text-brand-ice/85 max-w-3xl">
            Estimate your all-in study-abroad budget in 10 seconds. Compare destinations side by
            side. See the scholarships you should be targeting.
          </p>
        </div>
      </section>

      <Section bg="cream">
        <CostCalculator />
      </Section>
    </>
  );
}
