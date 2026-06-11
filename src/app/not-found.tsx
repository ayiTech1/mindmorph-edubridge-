import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="max-w-2xl text-center">
        <p className="text-sm uppercase tracking-widest text-brand-slate">404</p>
        <h1 className="mt-3 text-4xl font-bold text-brand-navy">We couldn&apos;t find that page.</h1>
        <p className="mt-4 text-brand-charcoal/80">It may have moved or never existed. Try one of these popular pages instead.</p>
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {[
            { href: "/study-abroad", label: "All destinations" },
            { href: "/scholarships", label: "Scholarships" },
            { href: "/test-prep", label: "Test preparation" },
            { href: "/success-stories", label: "Success stories" },
            { href: "/resources", label: "Resources & guides" },
            { href: "/contact", label: "Contact us" }
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block bg-white border border-[#E6F1FB] rounded-card p-4 hover:border-brand-sky">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <LinkButton href="/book">Or book a free consultation</LinkButton>
        </div>
      </Container>
    </section>
  );
}
