"use client";

import { useState } from "react";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

interface LeadFormProps {
  /** Pre-fill the destination when the form is rendered from a destination page. */
  defaultDestination?: string;
  /** Pre-fill the service when rendered from a service hub. */
  defaultService?: string;
  /** Submit label override. */
  ctaLabel?: string;
  /** Compact mode renders fewer fields (used in sidebars). */
  compact?: boolean;
  /** Where to redirect after success (defaults to /book?stage=calendar). */
  redirectTo?: string;
}

const countries = [
  { value: "GH", label: "Ghana" },
  { value: "NG", label: "Nigeria" },
  { value: "CI", label: "Côte d'Ivoire" },
  { value: "TG", label: "Togo" },
  { value: "BF", label: "Burkina Faso" },
  { value: "LR", label: "Liberia" },
  { value: "OTHER", label: "Other" }
];

const educationLevels = [
  "WASSCE / Secondary",
  "HND",
  "Bachelor's / BSc",
  "Master's / MSc",
  "Professional"
];

const services = [
  "Admissions",
  "Test Prep",
  "Counselling",
  "Visa",
  "Corporate Training",
  "Scholarships"
];

const destinations = [
  "United Kingdom",
  "Canada",
  "United States",
  "Australia",
  "Germany",
  "Türkiye",
  "Malaysia"
];

const timelines = [
  "This intake",
  "Next intake",
  "Exploring",
  "Unsure"
];

export function LeadForm({
  defaultDestination,
  defaultService,
  ctaLabel = "Continue to calendar",
  compact = false,
  redirectTo = "/book?stage=calendar"
}: LeadFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to submit form. Please try again or WhatsApp us.");
      trackEvent("lead_form_submit", { service: payload.service, destination: payload.destination });
      setSuccess(true);
      if (redirectTo) {
        // Soft redirect — let the success message flash for a moment.
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 800);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-brand-ice border border-brand-sky/30 rounded-card p-6 text-brand-navy">
        <p className="font-semibold">Got it. ✅</p>
        <p className="mt-1 text-sm">
          We&apos;ll WhatsApp you within 4 business hours. Taking you to the calendar…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" aria-label="Consultation enquiry">
      <Input label="Full name" name="fullName" required autoComplete="name" />
      <Input
        label="WhatsApp number"
        name="whatsapp"
        required
        type="tel"
        placeholder="e.g. +233 24 000 0000"
        autoComplete="tel"
        hint="Include country code. We respond on WhatsApp first."
      />
      {!compact && (
        <Input
          label="Email (optional)"
          name="email"
          type="email"
          autoComplete="email"
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Country" name="country" required defaultValue="GH">
          {countries.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </Select>
        <Select label="Education level" name="educationLevel" required defaultValue="">
          <option value="" disabled>Select…</option>
          {educationLevels.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Service" name="service" required defaultValue={defaultService ?? ""}>
          <option value="" disabled>Select…</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Select label="Destination" name="destination" defaultValue={defaultDestination ?? ""}>
          <option value="">No preference</option>
          {destinations.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
      </div>
      {!compact && (
        <Select label="Timeline" name="timeline" defaultValue="">
          <option value="">Select…</option>
          {timelines.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      )}
      <input type="hidden" name="source" value="WEBSITE_FORM" />
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Submitting…" : ctaLabel}
      </Button>
      <p className="text-xs text-brand-slate">
        By submitting you agree to our <a href="/privacy" className="underline">privacy policy</a>
        . We&apos;ll contact you on WhatsApp.
      </p>
    </form>
  );
}
