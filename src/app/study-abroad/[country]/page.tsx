import Image from "next/image";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LeadForm } from "@/components/forms/LeadForm";
import { destinations, destinationBySlug } from "@/content/destinations";
import { testimonials } from "@/content/testimonials";
import { siteConfig } from "@/lib/site-config";

interface Params {
  params: { country: string };
}

export async function generateStaticParams() {
  return destinations.map((d) => ({ country: d.slug }));
}

export async function generateMetadata({ params }: Params) {
  const dest = destinationBySlug(params.country);
  if (!dest) return {};
  return buildMetadata({
    title: `Study in ${dest.name} from Ghana & Nigeria`,
    description: dest.hero,
    path: `/study-abroad/${dest.slug}`,
    keywords: [
      `study in ${dest.name} from Ghana`,
      `study in ${dest.name} from Nigeria`,
      `${dest.name} student visa West Africa`,
      `${dest.name} university application Ghana`
    ],
    ogImage: dest.imageUrl
  });
}

export default function DestinationPage({ params }: Params) {
  const dest = destinationBySlug(params.country);
  if (!dest) return notFound();

  const localTestimonials = testimonials
    .filter((t) => t.destinationCountry === dest.name)
    .slice(0, 2);

  return (
    <>
      {/* FAQ + Place schema for SEO (spec §9.2 — FAQPage). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `How long does the ${dest.name} student visa take?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: dest.visaTimeline[dest.visaTimeline.length - 1]?.detail
                }
              },
              {
                "@type": "Question",
                name: `What is the average tuition to study in ${dest.name}?`,
                acceptedAnswer: { "@type": "Answer", text: dest.tuitionRange }
              }
            ]
          })
        }}
      />

      {/* Hero with country backdrop */}
      <section className="relative isolate overflow-hidden text-white">
        <div className="absolute inset-0 -z-20">
          <Image
            src={dest.imageUrl}
            alt={dest.imageAlt}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-navy/95 via-brand-navy/85 to-brand-ocean/70" />
        <div className="container relative py-24 md:py-28">
          <p className="text-sm uppercase tracking-widest text-brand-sky">Study Abroad</p>
          <div className="mt-3 flex items-center gap-4">
            <span className="text-6xl drop-shadow-lg" aria-hidden="true">{dest.flag}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white">{dest.name}</h1>
          </div>
          <p className="mt-5 text-lg text-brand-ice/90 max-w-3xl">{dest.hero}</p>
          <p className="mt-2 text-sm text-brand-ice/75 max-w-3xl">{dest.tagline}</p>
          <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
            {[
              { label: "Tuition", value: dest.tuitionRange },
              { label: "Visa success", value: dest.visaSuccessRate },
              { label: "Post-study work", value: dest.postStudyWork.split(" ").slice(0, 3).join(" ") },
              { label: "Living (USD)", value: `$${dest.monthlyLivingUSD.low}–${dest.monthlyLivingUSD.high}/mo` }
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-card p-3">
                <dt className="text-[10px] uppercase tracking-widest text-brand-ice/70">{s.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-white line-clamp-2">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Why study here */}
      <Section eyebrow="Why study here" title={`A quick snapshot of ${dest.name}.`} bg="cream">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Stat label="Tuition range" value={dest.tuitionRange} />
          <Stat label="Visa success rate" value={dest.visaSuccessRate} />
          <Stat label="Post-study work" value={dest.postStudyWork} />
          <Stat label="Mindmorph alumni" value={dest.notableAlumni} />
        </div>
      </Section>

      {/* Partner universities */}
      <Section eyebrow="Where our students go" title={`Universities we place students at in ${dest.name}.`}>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {dest.partnerUniversities.map((u) => (
            <li key={u} className="bg-white border border-[#E6F1FB] rounded-card p-4 text-sm font-medium text-brand-navy">
              {u}
            </li>
          ))}
        </ul>
      </Section>

      {/* Popular programmes */}
      <Section eyebrow="Programmes" title="Popular programmes & placement rates" bg="ice">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-brand-navy text-white">
              <tr>
                <th className="px-4 py-3">Programme category</th>
                <th className="px-4 py-3">Tuition range</th>
                <th className="px-4 py-3">Placement success</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C8D8EA]">
              {dest.popularProgrammes.map((p) => (
                <tr key={p.category} className="bg-white">
                  <td className="px-4 py-3 font-medium text-brand-charcoal">{p.category}</td>
                  <td className="px-4 py-3 text-brand-charcoal/80">{p.tuitionRange}</td>
                  <td className="px-4 py-3"><Badge tone="teal">{p.placementSuccess}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Scholarships */}
      <Section eyebrow="Funding" title="Scholarships available">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {dest.scholarships.map((s) => (
            <li key={s}>
              <Card>
                <p className="font-semibold text-brand-navy">{s}</p>
                <p className="mt-2 text-sm text-brand-slate">See full scholarship database for eligibility.</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* Visa timeline */}
      <Section
        eyebrow="Visa journey"
        title={`Your ${dest.name} visa, step by step.`}
        description="Mindmorph holds your hand through every stage — no surprises."
        bg="cream"
      >
        <ol className="space-y-4">
          {dest.visaTimeline.map((step) => (
            <li key={step.step} className="bg-white border border-[#E6F1FB] rounded-card p-5">
              <p className="font-semibold text-brand-navy">{step.step}</p>
              <p className="mt-1 text-sm text-brand-charcoal/80">{step.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Testimonials */}
      {localTestimonials.length > 0 && (
        <Section eyebrow="Students" title={`Mindmorph students now in ${dest.name}`} bg="ice">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {localTestimonials.map((t) => (
              <Card key={t.id}>
                <p className="italic text-brand-charcoal">“{t.quote}”</p>
                <p className="mt-4 font-semibold text-brand-navy">{t.studentName}</p>
                <p className="text-sm text-brand-slate">
                  {t.programme} — {t.destinationUniversity}
                </p>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* CTA — pre-filled lead form */}
      <Section
        eyebrow="Get started"
        title={`Get personalised guidance for ${dest.name}.`}
        description="Tell us a little about you and we&apos;ll WhatsApp you within 4 business hours."
      >
        <div className="max-w-2xl">
          <LeadForm defaultDestination={dest.name} />
          <p className="mt-6 text-sm text-brand-slate">
            Prefer to chat first? <a href={`https://wa.me/${siteConfig.whatsapp.number}`} className="underline">WhatsApp us</a>.
          </p>
        </div>
      </Section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-card border border-[#C8D8EA] p-5">
      <p className="text-xs uppercase tracking-wider text-brand-slate">{label}</p>
      <p className="mt-2 font-semibold text-brand-navy">{value}</p>
    </div>
  );
}
