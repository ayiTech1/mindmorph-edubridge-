"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function NewsletterForm({ segment = "general" }: { segment?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fd.get("email"), segment })
      });
      if (!res.ok) throw new Error("Subscribe failed.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <p className="text-sm text-brand-teal">
        Subscribed. Watch your inbox for the next scholarship roundup.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2" aria-label="Newsletter">
      <Input
        label="Email"
        name="email"
        type="email"
        required
        className="flex-1"
        placeholder="you@example.com"
      />
      <Button type="submit" disabled={submitting} className="sm:self-end">
        {submitting ? "…" : "Subscribe"}
      </Button>
      {error && <p className="sm:col-span-full text-sm text-red-600 mt-1">{error}</p>}
    </form>
  );
}
