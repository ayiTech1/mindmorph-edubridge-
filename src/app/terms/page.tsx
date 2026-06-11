import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";

export const metadata = buildMetadata({ title: "Terms of Use", path: "/terms" });

export default function TermsPage() {
  return (
    <article className="bg-white py-16">
      <Container className="max-w-3xl prose-body">
        <h1 className="text-3xl font-bold text-brand-navy">Terms of Use</h1>
        <p className="mt-3 text-sm text-brand-slate">Last updated: June 2026</p>
        <p className="mt-6">By using this website you agree to these terms. Mindmorph Edubridge provides education consultancy services. Information published here is for general guidance — visa rules, tuition fees, and scholarship deadlines change frequently and we recommend confirming with the official source before making financial commitments.</p>
        <h2 className="mt-8 text-xl font-bold text-brand-navy">Engagement</h2>
        <p>Formal engagement begins only after a signed services agreement. Free consultations and resources do not constitute a contract.</p>
        <h2 className="mt-8 text-xl font-bold text-brand-navy">Intellectual property</h2>
        <p>All content on this site — including guides, photography, and the Mindmorph brand — is the property of Mindmorph Edubridge unless otherwise indicated.</p>
      </Container>
    </article>
  );
}
