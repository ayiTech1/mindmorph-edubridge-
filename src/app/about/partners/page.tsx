import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { partners } from "@/content/partners";

export const metadata = buildMetadata({
  title: "Partner Universities",
  description: "60+ partner universities across our seven destination countries.",
  path: "/about/partners"
});

export default function PartnersPage() {
  const grouped = partners.reduce<Record<string, typeof partners>>((acc, p) => {
    (acc[p.country] ||= []).push(p);
    return acc;
  }, {});

  return (
    <>
      <section className="bg-brand-navy text-white py-20">
        <div className="container">
          <p className="uppercase tracking-widest text-xs text-brand-sky">About → Partners</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">Partner universities</h1>
          <p className="mt-5 text-lg text-brand-ice/85 max-w-3xl">
            Mindmorph is an authorised representative or recruitment partner of every institution listed below.
          </p>
        </div>
      </section>
      <Section bg="cream">
        <div className="space-y-10">
          {Object.entries(grouped).map(([country, list]) => (
            <div key={country}>
              <h2 className="text-2xl font-bold text-brand-navy">{country}</h2>
              <ul className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {list.map((p) => (
                  <li key={p.id} className="bg-white border border-[#E6F1FB] rounded-card p-4 text-sm font-medium text-brand-navy">
                    {p.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
