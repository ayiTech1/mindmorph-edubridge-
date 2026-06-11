"use client";

import { useState } from "react";

/**
 * Displays a freshly-generated temporary password with a one-click copy
 * affordance. Persists in the parent component until dismissed.
 */
export function TempPasswordReveal({
  email,
  password,
  onDismiss,
  variant = "invite"
}: {
  email: string;
  password: string;
  onDismiss: () => void;
  variant?: "invite" | "reset";
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — fall back to manual selection
    }
  }

  return (
    <div
      role="alert"
      className="rounded-card border border-brand-teal/40 bg-brand-teal/10 p-4 text-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 min-w-0">
          <p className="font-semibold text-[#0a5b41]">
            {variant === "invite" ? "Invite created." : "Password reset."}{" "}
            <span className="font-normal">
              Share this one-time password with{" "}
              <code className="font-mono">{email}</code>:
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="font-mono text-base bg-white border border-[#C8D8EA] rounded-lg px-3 py-2 select-all">
              {password}
            </code>
            <button
              type="button"
              onClick={onCopy}
              className="h-9 px-3 rounded-lg bg-brand-navy text-white text-xs font-medium"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-brand-slate">
            For security this is the only time it will be shown. They should sign in and
            change it on first use.
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-brand-slate hover:text-brand-charcoal text-xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
