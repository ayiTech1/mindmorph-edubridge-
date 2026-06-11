"use client";

import { useEffect } from "react";
import { LinkButton, Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to Sentry / your error tracker in production.
    console.error("[ui] unhandled error", error);
  }, [error]);

  return (
    <section className="py-24">
      <Container className="max-w-2xl text-center">
        <p className="text-sm uppercase tracking-widest text-brand-slate">Something went wrong</p>
        <h1 className="mt-3 text-4xl font-bold text-brand-navy">
          We hit a snag loading this page.
        </h1>
        <p className="mt-4 text-brand-charcoal/80">
          Our team has been notified. You can retry, head back home, or WhatsApp us.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-brand-slate">Ref: {error.digest}</p>
        )}
        <div className="mt-8 flex gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <LinkButton href="/" variant="secondary">
            Go home
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
