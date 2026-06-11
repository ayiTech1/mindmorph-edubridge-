"use client";

import { useState, useTransition } from "react";
import { archiveScholarship } from "@/lib/actions/scholarships";
import { ScholarshipDialog, type ScholarshipFormValue } from "./ScholarshipDialog";

export type ScholarshipRow = ScholarshipFormValue & {
  id: string;
  archived: boolean;
  deadlineLabel: string;
};

export function ScholarshipTable({ rows }: { rows: ScholarshipRow[] }) {
  const [editTarget, setEditTarget] = useState<ScholarshipRow | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function toggleArchive(row: ScholarshipRow) {
    setPendingId(row.id);
    startTransition(async () => {
      await archiveScholarship(row.id, !row.archived);
      setPendingId(null);
    });
  }

  return (
    <div className="bg-white border border-[#E6F1FB] rounded-card shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[#E6F1FB]">
        <h2 className="text-base font-semibold text-brand-navy">All scholarships</h2>
        <div className="flex gap-2">
          <button
            type="button"
            disabled
            title="Bulk CSV import — Phase 2"
            className="h-9 px-3 rounded-lg border border-brand-navy text-brand-navy text-sm opacity-60 cursor-not-allowed"
          >
            Import CSV
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="h-9 px-3 rounded-lg bg-brand-navy text-white text-sm font-medium"
          >
            + Add scholarship
          </button>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-brand-ice text-brand-navy">
          <tr>
            <th className="text-left px-4 py-3">Name</th>
            <th className="text-left px-4 py-3">Destination</th>
            <th className="text-left px-4 py-3">Level</th>
            <th className="text-left px-4 py-3">Deadline</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-right px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E6F1FB]">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-brand-slate">
                No scholarships yet. Click <em>Add scholarship</em> to create your first one.
              </td>
            </tr>
          ) : (
            rows.map((r) => {
              const expired = new Date(r.deadline).getTime() < Date.now();
              const status = r.archived ? "Archived" : expired ? "Deadline passed" : "Live";
              const statusClass = r.archived
                ? "bg-brand-slate/15 text-brand-charcoal"
                : expired
                ? "bg-brand-amber/15 text-[#8a5710]"
                : "bg-brand-teal/15 text-[#0e7a59]";
              return (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-brand-charcoal">{r.name}</td>
                  <td className="px-4 py-3 text-brand-charcoal">{r.destination}</td>
                  <td className="px-4 py-3 text-brand-slate">{r.level}</td>
                  <td className="px-4 py-3 text-brand-charcoal">{r.deadlineLabel}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-pill text-xs font-medium ${statusClass}`}
                    >
                      {status}
                    </span>
                  </td>
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
                      onClick={() => toggleArchive(r)}
                      disabled={pendingId === r.id}
                      className={`h-8 px-3 rounded-md text-xs ${
                        r.archived
                          ? "bg-brand-teal text-white hover:bg-[#178463]"
                          : "border border-brand-amber text-[#8a5710] hover:bg-brand-amber/10"
                      } disabled:opacity-60`}
                    >
                      {pendingId === r.id
                        ? "…"
                        : r.archived
                        ? "Restore"
                        : "Archive"}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <ScholarshipDialog
        mode="create"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <ScholarshipDialog
        mode="edit"
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        initial={editTarget ?? undefined}
      />
    </div>
  );
}
