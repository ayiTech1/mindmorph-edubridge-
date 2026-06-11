"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { setArticleStatus } from "@/lib/actions/articles";
import { ArticleDialog, type ArticleFormValue } from "./ArticleDialog";

export type AdminArticleRow = ArticleFormValue & {
  id: string;
  publishedAtLabel: string;
  updatedAtLabel: string;
  readTimeMin: number;
};

const STATUS_TONE: Record<AdminArticleRow["status"], string> = {
  DRAFT: "bg-brand-slate/15 text-brand-charcoal",
  REVIEW: "bg-brand-amber/15 text-[#8a5710]",
  PUBLISHED: "bg-brand-teal/15 text-[#0e7a59]",
  ARCHIVED: "bg-brand-navy/10 text-brand-navy"
};

const STATUS_LABEL: Record<AdminArticleRow["status"], string> = {
  DRAFT: "Draft",
  REVIEW: "In review",
  PUBLISHED: "Published",
  ARCHIVED: "Archived"
};

export function ArticleTable({ rows }: { rows: AdminArticleRow[] }) {
  const [editTarget, setEditTarget] = useState<AdminArticleRow | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function transition(id: string, next: AdminArticleRow["status"]) {
    setPendingId(id);
    startTransition(async () => {
      await setArticleStatus(id, next);
      setPendingId(null);
    });
  }

  return (
    <div className="bg-white border border-[#E6F1FB] rounded-card shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[#E6F1FB]">
        <div>
          <h2 className="text-base font-semibold text-brand-navy">Articles</h2>
          <p className="text-xs text-brand-slate">
            Draft, review, publish, and archive — every change is audited.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="h-9 px-3 rounded-lg bg-brand-navy text-white text-sm font-medium"
        >
          + New article
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-ice text-brand-navy">
            <tr>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Updated</th>
              <th className="text-left px-4 py-3">Read</th>
              <th className="text-right px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6F1FB]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-slate">
                  No articles yet. Click <em>New article</em> to write your first one.
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
                      {r.title}
                    </button>
                    <p className="text-xs font-mono text-brand-slate mt-0.5">/{r.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-brand-charcoal">{r.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-pill text-xs font-medium ${STATUS_TONE[r.status]}`}
                    >
                      {STATUS_LABEL[r.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-slate">{r.updatedAtLabel}</td>
                  <td className="px-4 py-3 text-brand-slate">{r.readTimeMin} min</td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    {r.status === "PUBLISHED" && (
                      <Link
                        href={`/resources/${r.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 px-3 rounded-md border border-[#C8D8EA] text-brand-navy text-xs hover:bg-brand-ice inline-flex items-center"
                      >
                        View
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditTarget(r)}
                      className="h-8 px-3 rounded-md border border-[#C8D8EA] text-brand-navy text-xs hover:bg-brand-ice"
                    >
                      Edit
                    </button>
                    {r.status !== "PUBLISHED" && r.status !== "ARCHIVED" && (
                      <button
                        type="button"
                        disabled={pendingId === r.id}
                        onClick={() => transition(r.id, "PUBLISHED")}
                        className="h-8 px-3 rounded-md bg-brand-teal text-white text-xs hover:bg-[#178463] disabled:opacity-60"
                      >
                        {pendingId === r.id ? "…" : "Publish"}
                      </button>
                    )}
                    {r.status === "PUBLISHED" && (
                      <button
                        type="button"
                        disabled={pendingId === r.id}
                        onClick={() => transition(r.id, "DRAFT")}
                        className="h-8 px-3 rounded-md border border-brand-amber text-[#8a5710] text-xs hover:bg-brand-amber/10 disabled:opacity-60"
                      >
                        {pendingId === r.id ? "…" : "Unpublish"}
                      </button>
                    )}
                    {r.status !== "ARCHIVED" ? (
                      <button
                        type="button"
                        disabled={pendingId === r.id}
                        onClick={() => transition(r.id, "ARCHIVED")}
                        className="h-8 px-3 rounded-md border border-[#C8D8EA] text-brand-slate text-xs hover:bg-brand-slate/10 disabled:opacity-60"
                      >
                        Archive
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={pendingId === r.id}
                        onClick={() => transition(r.id, "DRAFT")}
                        className="h-8 px-3 rounded-md bg-brand-navy text-white text-xs hover:bg-brand-ocean disabled:opacity-60"
                      >
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ArticleDialog
        mode="create"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <ArticleDialog
        mode="edit"
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        initial={editTarget ?? undefined}
      />
    </div>
  );
}
