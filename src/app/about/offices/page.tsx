import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Our Offices",
  description: "Mindmorph Edubridge offices and where to find us.",
  path: "/about/offices"
});

export default function OfficesPage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-20">
        <div className="container">
          <p className="uppercase tracking-widest text-xs text-brand-sky">About → Offices</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">Find us in Accra and across West Africa.</h1>
        </div>
      </section>
      <Section bg="cream">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {siteConfig.offices.map((o) => (
            <Card key={o.city}>
              <h2 className="text-xl font-semibold text-brand-navy">{o.city}, {o.country}</h2>
              <p className="mt-3 text-sm text-brand-charcoal/85">{o.address}</p>
              <p className="mt-1 text-sm text-brand-charcoal/85">{o.phone}</p>
              <p className="mt-1 text-sm text-brand-slate">{o.hours}</p>
            </Card>
          ))}
          <Card>
            <h2 className="text-xl font-semibold text-brand-navy">Lagos — Coming 2027</h2>
            <p className="mt-3 text-sm text-brand-charcoal/85">
              We&apos;re opening a permanent Lagos presence. In the meantime, we host monthly pop-up
              clinics in Lekki and Ikeja.
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}
