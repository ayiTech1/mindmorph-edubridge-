"use client";

import { useState, useTransition } from "react";
import { updateLeadStage } from "@/lib/actions/leads";
import { cn } from "@/lib/utils";

const STAGES = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "CONSULTATION_BOOKED", label: "Consultation booked" },
  { value: "ACTIVE", label: "Active" },
  { value: "VISA_STAGE", label: "Visa stage" },
  { value: "PLACED", label: "Placed" },
  { value: "LOST", label: "Lost" }
];

export function LeadStageControl({
  leadId,
  currentStage
}: {
  leadId: string;
  currentStage: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-brand-slate mb-2">Pipeline stage</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {STAGES.map((s) => {
          const active = s.value === currentStage;
          return (
            <form
              key={s.value}
              action={(fd) => {
                startTransition(async () => {
                  setError(null);
                  const res = await updateLeadStage(leadId, fd);
                  if (!res.ok) setError(res.error);
                });
              }}
            >
              <input type="hidden" name="stage" value={s.value} />
              <button
                type="submit"
                disabled={pending || active}
                className={cn(
                  "w-full px-3 py-2 rounded-lg text-xs font-medium border transition",
                  active
                    ? "bg-brand-navy text-white border-brand-navy cursor-default"
                    : "bg-white border-[#C8D8EA] text-brand-charcoal hover:border-brand-sky hover:text-brand-navy",
                  pending && !active && "opacity-60"
                )}
                aria-pressed={active}
              >
                {s.label}
              </button>
            </form>
          );
        })}
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
