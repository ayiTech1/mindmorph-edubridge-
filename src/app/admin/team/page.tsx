import { getServerSession } from "next-auth";
import { Topbar } from "@/components/admin/Topbar";
import { TeamTable, type AdminTeamRow } from "@/components/admin/team/TeamTable";
import { authOptions, type AppSession } from "@/lib/auth";
import { getTeamForAdmin } from "@/lib/admin-data";
import { isDbConfigured } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TeamAdminPage() {
  const [rows, session] = await Promise.all([
    getTeamForAdmin(),
    getServerSession(authOptions) as Promise<AppSession | null>
  ]);
  const dbReady = isDbConfigured();
  const currentUserId = session?.user?.id;
  const currentUserRole = session?.user?.role as AdminTeamRow["role"] | undefined;

  return (
    <>
      <Topbar title="Team members" />
      <div className="p-6 space-y-6">
        {!dbReady && (
          <div className="bg-brand-amber/10 border border-brand-amber/40 rounded-card p-4 text-sm text-[#7a4f10]">
            <strong className="font-semibold">Dev mode.</strong> Team management requires MySQL —
            set <code className="font-mono">DATABASE_URL</code> and run{" "}
            <code className="font-mono">npm run prisma:push && npm run prisma:seed</code> to
            invite real accounts.
          </div>
        )}

        <TeamTable
          rows={rows}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
        />

        <p className="text-xs text-brand-slate">
          Spec §5.11: invite by email, change roles (super-admin only), deactivate without
          deleting history, reset passwords. Every action is audited.
        </p>
      </div>
    </>
  );
}
