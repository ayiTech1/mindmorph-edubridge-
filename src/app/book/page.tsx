import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { LeadForm } from "@/components/forms/LeadForm";
import { CalEmbed } from "@/components/booking/CalEmbed";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: "Book a Free Consultation",
  description: "30-minute consultation with a Mindmorph specialist. By video, phone, or in person in Accra.",
  path: "/book",
  noindex: true // spec §4.4 — conversion page, not for search
});

export default function BookPage() {
  const calComUser = process.env.NEXT_PUBLIC_CALCOM_USER;
  const calComEvent = process.env.NEXT_PUBLIC_CALCOM_EVENT ?? "consultation";
  return (
    <>
      <section className="bg-brand-navy text-white py-16">
        <div className="container max-w-4xl">
          <p className="uppercase tracking-widest text-xs text-brand-sky">Book</p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-white">
            Your free 30-minute consultation
          </h1>
          <p className="mt-4 text-brand-ice/85 max-w-2xl">
            One form. One short conversation. A clear next step for your education journey.
          </p>
        </div>
      </section>

      <Section bg="cream">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          {/* Step 1: form */}
          <Card className="p-6 md:p-8" hover={false}>
            <h2 className="text-xl font-semibold text-brand-navy">Step 1 — Tell us about you</h2>
            <p className="mt-1 text-sm text-brand-charcoal/80">Seven fields. About 2 minutes.</p>
            <div className="mt-6">
              <LeadForm ctaLabel="Continue" redirectTo="/book?stage=calendar" />
            </div>
          </Card>

          {/* Step 2 preview: calendar embed */}
          <aside className="space-y-5">
            <Card hover={false}>
              <h3 className="font-semibold text-brand-navy">Step 2 — Pick a time</h3>
              <p className="mt-2 text-sm text-brand-charcoal/80">
                After step 1 we&apos;ll show available consultant times. Video, phone, or in-person at our Accra office.
              </p>
              {calComUser ? (
                <div className="mt-4 -mx-1">
                  <CalEmbed user={calComUser} event={calComEvent} />
                </div>
              ) : (
                <div className="mt-4 aspect-[4/3] bg-brand-ice border border-dashed border-brand-sky/50 rounded-lg flex items-center justify-center text-sm text-brand-slate text-center px-6">
                  Set <code className="font-mono">NEXT_PUBLIC_CALCOM_USER</code> in <code className="font-mono">.env.local</code> to mount the Cal.com calendar here.
                </div>
              )}
            </Card>
            <Card hover={false}>
              <h3 className="font-semibold text-brand-navy">Prefer WhatsApp?</h3>
              <p className="mt-2 text-sm text-brand-charcoal/80">
                If you&apos;d rather chat first, message us directly — we usually reply within 2 hours.
              </p>
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center w-full h-12 rounded-lg bg-[#25D366] text-white font-medium"
              >
                WhatsApp {siteConfig.whatsapp.number}
              </a>
            </Card>
            <Card hover={false}>
              <h3 className="font-semibold text-brand-navy">Social proof</h3>
              <p className="mt-2 text-sm text-brand-charcoal/80">
                4,200+ consultations completed. 94% visa success. 7 destination countries.
              </p>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
