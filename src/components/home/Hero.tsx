import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * Homepage hero — full-width photographic background with brand gradient overlay.
 * The image is served from Unsplash for now; in production it moves to Cloudinary
 * with automatic AVIF/WebP via next/image (already configured).
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden text-white">
      {/* Background photo */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2000&h=1200&q=80"
          alt=""
          role="presentation"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>
      {/* Brand gradient overlay — keeps the headline AA contrast. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-navy/95 via-brand-ocean/90 to-brand-sky/80" />
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-40">
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-brand-sky/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-brand-ocean/50 blur-3xl" />
      </div>

      <Container className="relative py-24 md:py-32">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-white/15 backdrop-blur text-xs uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
            Trusted by 4,200+ West African students
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-[3.4rem] font-bold leading-[1.05] tracking-tight text-white">
            Your path to a global education,
            <span className="block text-brand-ice/95">from West Africa.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-brand-ice/90 max-w-2xl">
            Admissions, test prep, visas, and scholarships — handled end-to-end by Ghana&apos;s most
            experienced education consultancy. UK · Canada · USA · Australia · Germany · Türkiye · Malaysia.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <LinkButton href="/book" size="lg">
              Book your free consultation
            </LinkButton>
            <LinkButton href="/study-abroad" variant="ghost" size="lg">
              Explore destinations
            </LinkButton>
            <LinkButton href={buildWhatsAppLink()} variant="whatsapp" size="lg">
              WhatsApp us
            </LinkButton>
          </div>

          <ul className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 text-xs uppercase tracking-widest text-brand-ice/75">
            {[
              "94% visa approvals",
              "60+ partner unis",
              "7 destinations",
              "Free 30-min consult"
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
