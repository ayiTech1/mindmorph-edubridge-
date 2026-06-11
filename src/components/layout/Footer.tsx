import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { LinkButton } from "@/components/ui/Button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

const columns = [
  {
    heading: "Services",
    links: [
      { label: "Study Abroad", href: "/study-abroad" },
      { label: "Test Preparation", href: "/test-prep" },
      { label: "Counselling", href: "/counselling" },
      { label: "Corporate Training", href: "/corporate" },
      { label: "Student Support", href: "/student-support" }
    ]
  },
  {
    heading: "Destinations",
    links: [
      { label: "United Kingdom", href: "/study-abroad/uk" },
      { label: "Canada", href: "/study-abroad/canada" },
      { label: "United States", href: "/study-abroad/usa" },
      { label: "Australia", href: "/study-abroad/australia" },
      { label: "Germany", href: "/study-abroad/germany" },
      { label: "Türkiye", href: "/study-abroad/turkey" },
      { label: "Malaysia", href: "/study-abroad/malaysia" }
    ]
  },
  {
    heading: "Resources",
    links: [
      { label: "Scholarships", href: "/scholarships" },
      { label: "Cost calculator", href: "/cost-calculator" },
      { label: "Resources & Blog", href: "/resources" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Events", href: "/events" }
    ]
  },
  {
    heading: "Mindmorph",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our team", href: "/about/team" },
      { label: "Partner universities", href: "/about/partners" },
      { label: "Our offices", href: "/about/offices" },
      { label: "Contact", href: "/contact" }
    ]
  }
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" />
            <p className="text-sm text-brand-ice/90 max-w-sm">{siteConfig.shortDescription}</p>
            <div className="flex flex-col gap-2">
              <LinkButton href={buildWhatsAppLink()} variant="whatsapp" size="sm">
                WhatsApp us
              </LinkButton>
              <LinkButton href="/book" variant="ghost" size="sm">
                Book free consultation
              </LinkButton>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-ice mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/85 hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-10 border-white/10" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-white/75">
          <p>© {year} Mindmorph Edubridge. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/cookie-policy" className="hover:text-white">Cookies</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white">YouTube</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
