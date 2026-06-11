import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function FinalCTA() {
  return (
    <section className="bg-brand-navy text-white">
      <Container className="py-20 md:py-28 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to start your journey?</h2>
        <p className="mt-4 text-lg text-brand-ice/85 max-w-2xl mx-auto">
          One conversation. A clear plan. A trusted team beside you for every step from Accra to your campus.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <LinkButton href="/book" size="lg">
            Book your free consultation
          </LinkButton>
          <LinkButton href={buildWhatsAppLink()} variant="whatsapp" size="lg">
            WhatsApp us now
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
