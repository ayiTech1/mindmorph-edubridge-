"use client";

import { useTransition } from "react";
import { assignConsultant } from "@/lib/actions/leads";

interface Option {
  id: string;
  name: string;
}

export function LeadAssign({
  leadId,
  current,
  options
}: {
  leadId: string;
  current: string | null;
  options: Option[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => {
        startTransition(async () => {
          await assignConsultant(leadId, fd);
        });
      }}
      className="flex items-center gap-2"
    >
      <select
        name="consultantId"
        defaultValue={current ?? ""}
        disabled={pending}
        className="flex-1 h-10 px-3 rounded-lg border border-[#C8D8EA] bg-white text-sm"
        aria-label="Assigned consultant"
      >
        <option value="">— Unassigned —</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="h-10 px-3 rounded-lg bg-brand-navy text-white text-sm font-medium disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
