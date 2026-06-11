"use client";

import { useState, useTransition } from "react";
import { updateLeadNotes } from "@/lib/actions/leads";

export function LeadNotes({ leadId, initial }: { leadId: string; initial: string }) {
  const [notes, setNotes] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setStatus("idle");
      setError(null);
      const res = await updateLeadNotes(leadId, formData);
      if (res.ok) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        setStatus("error");
        setError(res.error);
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <textarea
        name="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={8}
        placeholder="Internal consultant notes — not visible to the student."
        className="w-full px-4 py-3 rounded-lg border border-[#C8D8EA] focus:border-brand-navy outline-none bg-white text-sm leading-relaxed"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-brand-slate">
          {status === "saved" && <span className="text-brand-teal">Saved.</span>}
          {status === "error" && <span className="text-red-600">{error}</span>}
          {status === "idle" && `${notes.length} / 5000 characters`}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="h-10 px-4 rounded-lg bg-brand-navy text-white text-sm font-medium disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save notes"}
        </button>
      </div>
    </form>
  );
}
