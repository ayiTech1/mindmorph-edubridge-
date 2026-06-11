import { Topbar } from "@/components/admin/Topbar";
import { ScholarshipTable } from "@/components/admin/scholarships/ScholarshipTable";
import { getScholarshipsForAdmin } from "@/lib/admin-data";
import { isDbConfigured } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ScholarshipsAdminPage() {
  const rows = await getScholarshipsForAdmin();
  const dbReady = isDbConfigured();

  return (
    <>
      <Topbar title="Scholarships" />
      <div className="p-6 space-y-6">
        {!dbReady && (
          <div className="bg-brand-amber/10 border border-brand-amber/40 rounded-card p-4 text-sm text-[#7a4f10]">
            <strong className="font-semibold">Dev mode.</strong> Set{" "}
            <code className="font-mono">DATABASE_URL</code> and run{" "}
            <code className="font-mono">npm run prisma:push && npm run prisma:seed</code> to
            persist scholarships.
          </div>
        )}

        <ScholarshipTable rows={rows} />

        <p className="text-xs text-brand-slate">
          Tip: scholarships past their deadline are auto-archived from the public list (spec §5.8).
          You can restore an archived scholarship at any time.
        </p>
      </div>
    </>
  );
}
