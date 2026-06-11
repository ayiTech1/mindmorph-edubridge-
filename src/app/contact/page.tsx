import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Contact Mindmorph",
  description: "Get in touch by WhatsApp, email, or visit our Accra office.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-20">
        <div className="container">
          <p className="uppercase tracking-widest text-xs text-brand-sky">Contact</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">We&apos;d love to hear from you.</h1>
          <p className="mt-5 text-lg text-brand-ice/85 max-w-3xl">
            WhatsApp is the fastest way to reach us. We respond to most messages within 2 hours during working hours.
          </p>
        </div>
      </section>

      <Section bg="cream">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
          <Card hover={false}>
            <h2 className="text-xl font-semibold text-brand-navy">Send us a message</h2>
            <p className="mt-1 text-sm text-brand-charcoal/80">We respond on WhatsApp.</p>
            <div className="mt-6"><ContactForm /></div>
          </Card>
          <aside className="space-y-5">
            <Card>
              <h3 className="font-semibold text-brand-navy">Office</h3>
              <p className="mt-2 text-sm text-brand-charcoal/85">{siteConfig.offices[0].address}</p>
              <p className="mt-1 text-sm text-brand-slate">{siteConfig.offices[0].hours}</p>
            </Card>
            <Card>
              <h3 className="font-semibold text-brand-navy">Email</h3>
              <a href={`mailto:${siteConfig.contact.email}`} className="text-brand-ocean">
                {siteConfig.contact.email}
              </a>
            </Card>
            <Card>
              <h3 className="font-semibold text-brand-navy">Phone</h3>
              <p className="text-brand-charcoal">{siteConfig.contact.phone}</p>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
