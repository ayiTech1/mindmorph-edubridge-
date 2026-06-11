"use client";

import { useState, useTransition } from "react";
import {
  toggleTestimonialFeatured,
  deleteTestimonial
} from "@/lib/actions/testimonials";
import {
  TestimonialDialog,
  type TestimonialFormValue
} from "./TestimonialDialog";

export type AdminTestimonialRow = TestimonialFormValue & {
  id: string;
  updatedAtLabel: string;
};

export function TestimonialTable({ rows }: { rows: AdminTestimonialRow[] }) {
  const [editTarget, setEditTarget] = useState<AdminTestimonialRow | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const featuredCount = rows.filter((r) => r.featured).length;

  function onToggleFeatured(row: AdminTestimonialRow) {
    setPendingId(row.id);
    setError(null);
    startTransition(async () => {
      const res = await toggleTestimonialFeatured(row.id, !row.featured);
      if (!res.ok) setError(res.error);
      setPendingId(null);
    });
  }

  function onDelete(row: AdminTestimonialRow) {
    if (!confirm(`Delete "${row.studentName}"? This cannot be undone.`)) return;
    setPendingId(row.id);
    setError(null);
    startTransition(async () => {
      const res = await deleteTestimonial(row.id);
      if (!res.ok) setError(res.error);
      setPendingId(null);
    });
  }

  return (
    <div className="bg-white border border-[#E6F1FB] rounded-card shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[#E6F1FB]">
        <div>
          <h2 className="text-base font-semibold text-brand-navy">Success stories</h2>
          <p className="text-xs text-brand-slate">
            {featuredCount} featured on the homepage carousel. Public on the{" "}
            <code className="font-mono">/success-stories</code> page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="h-9 px-3 rounded-lg bg-brand-navy text-white text-sm font-medium"
        >
          + Add story
        </button>
      </div>

      {error && (
        <p className="px-4 py-2 text-xs bg-red-50 border-b border-red-200 text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-ice text-brand-navy">
            <tr>
              <th className="text-left px-4 py-3">Student</th>
              <th className="text-left px-4 py-3">Destination</th>
              <th className="text-left px-4 py-3">Programme</th>
              <th className="text-left px-4 py-3">Service</th>
              <th className="text-left px-4 py-3">Featured</th>
              <th className="text-left px-4 py-3">Updated</th>
              <th className="text-right px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6F1FB]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-brand-slate">
                  No success stories yet. Click <em>Add story</em> to publish your first one.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-brand-cream/60">
                  <td className="px-4 py-3 font-medium text-brand-charcoal">
                    <button
                      type="button"
                      onClick={() => setEditTarget(r)}
                      className="text-left hover:text-brand-navy hover:underline"
                    >
                      {r.studentName}
                    </button>
                    <p className="text-xs text-brand-slate mt-0.5">From {r.originCountry}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-brand-charcoal">{r.destinationCty}</p>
                    <p className="text-xs text-brand-slate mt-0.5 line-clamp-1">
                      {r.destinationUni}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-brand-charcoal max-w-xs line-clamp-2">
                    {r.programme}
                  </td>
                  <td className="px-4 py-3 text-brand-slate">{r.serviceType}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onToggleFeatured(r)}
                      disabled={pendingId === r.id}
                      aria-pressed={r.featured}
                      title={r.featured ? "Unfeature" : "Feature on homepage"}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-medium ${
                        r.featured
                          ? "bg-brand-teal/15 text-[#0e7a59]"
                          : "bg-brand-slate/15 text-brand-charcoal"
                      } disabled:opacity-60`}
                    >
                      <span aria-hidden="true">{r.featured ? "★" : "☆"}</span>
                      {r.featured ? "Featured" : "Not featured"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-brand-slate">{r.updatedAtLabel}</td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setEditTarget(r)}
                      className="h-8 px-3 rounded-md border border-[#C8D8EA] text-brand-navy text-xs hover:bg-brand-ice"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(r)}
                      disabled={pendingId === r.id}
                      className="h-8 px-3 rounded-md border border-red-200 text-red-700 text-xs hover:bg-red-50 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TestimonialDialog
        mode="create"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <TestimonialDialog
        mode="edit"
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        initial={editTarget ?? undefined}
      />
    </div>
  );
}
