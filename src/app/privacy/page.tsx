import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Mindmorph Edubridge collects, uses, and protects your data.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <article className="bg-white py-16">
      <Container className="max-w-3xl prose-body">
        <h1 className="text-3xl font-bold text-brand-navy">Privacy Policy</h1>
        <p className="mt-3 text-sm text-brand-slate">Last updated: June 2026</p>

        <h2 className="mt-10 text-xl font-bold text-brand-navy">What we collect</h2>
        <p>When you submit any form on this website we collect: full name, WhatsApp number, email (if provided), country of residence, education level, service interest, and intended destination.</p>

        <h2 className="mt-8 text-xl font-bold text-brand-navy">Why we collect it</h2>
        <p>To respond to your enquiry, schedule consultations, and (with your consent) keep you informed about scholarships and intake deadlines relevant to your goals.</p>

        <h2 className="mt-8 text-xl font-bold text-brand-navy">Where we store it</h2>
        <p>Student data is stored in our admin database hosted in the EU region. We retain inactive lead data for up to 3 years, after which it is permanently deleted.</p>

        <h2 className="mt-8 text-xl font-bold text-brand-navy">Who we share it with</h2>
        <p>Only with partner universities you have explicitly asked us to apply to. We never sell your data.</p>

        <h2 className="mt-8 text-xl font-bold text-brand-navy">Your rights</h2>
        <p>You can request data export, correction, or deletion at any time by emailing <a className="underline" href="mailto:privacy@mindmorphedubridge.com">privacy@mindmorphedubridge.com</a>. We honour deletion requests within 30 days.</p>
      </Container>
    </article>
  );
}
