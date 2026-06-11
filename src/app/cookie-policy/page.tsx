import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";

export const metadata = buildMetadata({ title: "Cookie Policy", path: "/cookie-policy" });

export default function CookiePolicy() {
  return (
    <article className="bg-white py-16">
      <Container className="max-w-3xl prose-body">
        <h1 className="text-3xl font-bold text-brand-navy">Cookie Policy</h1>
        <p className="mt-3 text-sm text-brand-slate">Last updated: June 2026</p>
        <p className="mt-6">We use cookies to remember your preferences (e.g. language), measure traffic via Google Analytics 4, and protect against spam via reCAPTCHA.</p>

        <h2 className="mt-8 text-xl font-bold text-brand-navy">Cookies in use</h2>
        <table className="mt-4 w-full text-sm">
          <thead className="bg-brand-ice">
            <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Purpose</th><th className="text-left p-3">Expires</th></tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#E6F1FB]"><td className="p-3">_ga</td><td className="p-3">Google Analytics — unique visitor ID</td><td className="p-3">2 years</td></tr>
            <tr className="border-b border-[#E6F1FB]"><td className="p-3">_gid</td><td className="p-3">Google Analytics — session ID</td><td className="p-3">24 hours</td></tr>
            <tr className="border-b border-[#E6F1FB]"><td className="p-3">mindmorph.locale</td><td className="p-3">Language preference</td><td className="p-3">1 year</td></tr>
            <tr><td className="p-3">mindmorph.cookie-consent.v1</td><td className="p-3">Records your cookie consent</td><td className="p-3">1 year</td></tr>
          </tbody>
        </table>
      </Container>
    </article>
  );
}
