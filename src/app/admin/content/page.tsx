import { Topbar } from "@/components/admin/Topbar";
import { ArticleTable } from "@/components/admin/articles/ArticleTable";
import { getArticlesForAdmin } from "@/lib/admin-data";
import { isDbConfigured } from "@/lib/prisma";
import { destinations } from "@/content/destinations";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const articles = await getArticlesForAdmin();
  const dbReady = isDbConfigured();

  return (
    <>
      <Topbar title="Pages & articles" />
      <div className="p-6 space-y-8">
        {!dbReady && (
          <div className="bg-brand-amber/10 border border-brand-amber/40 rounded-card p-4 text-sm text-[#7a4f10]">
            <strong className="font-semibold">Dev mode.</strong> Article authoring is disabled —
            set <code className="font-mono">DATABASE_URL</code> and run{" "}
            <code className="font-mono">npm run prisma:push && npm run prisma:seed</code> to start
            writing.
          </div>
        )}

        <ArticleTable rows={articles} />

        {/* Destination / hub pages — Phase 2 will move these into Sanity. */}
        <section className="bg-white border border-[#E6F1FB] rounded-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#E6F1FB]">
            <div>
              <h2 className="text-base font-semibold text-brand-navy">Destination pages</h2>
              <p className="text-xs text-brand-slate">
                Read-only in this release — content lives in code (
                <code className="font-mono">src/content/destinations.ts</code>). Sanity migration
                arrives in Phase 2.
              </p>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-brand-ice text-brand-navy">
              <tr>
                <th className="text-left px-4 py-3">Slug</th>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6F1FB]">
              {destinations.map((d) => (
                <tr key={d.slug}>
                  <td className="px-4 py-3 font-mono text-xs text-brand-slate">
                    /study-abroad/{d.slug}
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-charcoal">Study in {d.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2.5 py-1 rounded-pill text-xs font-medium bg-brand-teal/15 text-[#0e7a59]">
                      Published
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
