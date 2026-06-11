"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "WEBSITE_FORM", service: "Contact" })
      });
      if (!res.ok) throw new Error("Submission failed.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="bg-brand-ice border border-brand-sky/30 rounded-card p-6">
        <p className="font-semibold text-brand-navy">Message received.</p>
        <p className="mt-2 text-sm text-brand-charcoal/80">
          We&apos;ll respond on WhatsApp within 4 business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Full name" name="fullName" required autoComplete="name" />
      <Input
        label="WhatsApp number"
        name="whatsapp"
        required
        type="tel"
        autoComplete="tel"
        hint="Include country code."
      />
      <Input label="Email (optional)" name="email" type="email" autoComplete="email" />
      <Textarea label="Your message" name="notes" required />
      <input type="hidden" name="country" value="GH" />
      <input type="hidden" name="educationLevel" value="Other" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
