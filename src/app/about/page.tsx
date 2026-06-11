import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "About Mindmorph Edubridge",
  description:
    "West Africa's most trusted education consultancy — guiding students from Accra, Lagos, Abidjan to global universities.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <div className="absolute inset-0 -z-20">
          <Image
            src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=2000&h=1000&q=80"
            alt=""
            role="presentation"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-navy/95 via-brand-navy/85 to-brand-ocean/70" />
        <div className="container relative py-24">
          <p className="uppercase tracking-widest text-xs text-brand-sky">About</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Reshaping minds. Connecting dreams.
          </h1>
          <p className="mt-5 text-lg text-brand-ice/90 max-w-3xl">{siteConfig.longDescription}</p>
        </div>
      </section>

      <Section eyebrow="What we believe" title="The Mindmorph philosophy" bg="cream">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { h: "Clarity over confusion", p: "Every Mindmorph student leaves their first consultation with a written plan." },
            { h: "Outcomes over output", p: "We measure ourselves on placements, visa approvals, and graduate trajectories — not application volume." },
            { h: "Africa-first by design", p: "From WhatsApp-first communication to bandwidth-aware design, we build for the realities here." }
          ].map((c) => (
            <Card key={c.h}>
              <h3 className="font-semibold text-brand-navy">{c.h}</h3>
              <p className="mt-2 text-sm text-brand-charcoal/80">{c.p}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Get to know Mindmorph">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <li>
            <Card>
              <Link href="/about/team">
                <h3 className="font-semibold text-brand-navy">Our team</h3>
                <p className="mt-2 text-sm text-brand-charcoal/80">The consultants, examiners, and visa specialists behind every successful application.</p>
                <p className="mt-3 text-sm font-medium text-brand-ocean">Meet the team →</p>
              </Link>
            </Card>
          </li>
          <li>
            <Card>
              <Link href="/about/partners">
                <h3 className="font-semibold text-brand-navy">Partner universities</h3>
                <p className="mt-2 text-sm text-brand-charcoal/80">60+ partner institutions across our seven destination countries.</p>
                <p className="mt-3 text-sm font-medium text-brand-ocean">See partners →</p>
              </Link>
            </Card>
          </li>
          <li>
            <Card>
              <Link href="/about/offices">
                <h3 className="font-semibold text-brand-navy">Our offices</h3>
                <p className="mt-2 text-sm text-brand-charcoal/80">HQ in Accra, with consultants on the ground across West Africa.</p>
                <p className="mt-3 text-sm font-medium text-brand-ocean">Find us →</p>
              </Link>
            </Card>
          </li>
        </ul>
      </Section>

      <Section bg="ice">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-navy">Speak with a consultant.</h2>
          <p className="mt-3 text-brand-charcoal/80 max-w-2xl mx-auto">
            One free 30-minute session. No commitment. We&apos;ll either point you to a clear next step
            — or tell you honestly that we&apos;re not the right fit.
          </p>
          <div className="mt-6">
            <LinkButton href="/book">Book your consultation</LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
