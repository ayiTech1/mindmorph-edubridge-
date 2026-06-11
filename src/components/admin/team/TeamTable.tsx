"use client";

import { useState, useTransition } from "react";
import {
  changeRole,
  resetMemberPassword,
  setMemberActive
} from "@/lib/actions/team";
import { InviteMemberDialog } from "./InviteMemberDialog";
import {
  EditProfileDialog,
  type TeamProfileValue
} from "./EditProfileDialog";
import { TempPasswordReveal } from "./TempPasswordReveal";

export type AdminTeamRow = TeamProfileValue & {
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "CONSULTANT" | "VIEWER";
  active: boolean;
  lastLoginLabel: string;
};

const ROLE_LABEL: Record<AdminTeamRow["role"], string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  CONSULTANT: "Consultant",
  VIEWER: "Viewer"
};

const ROLE_TONE: Record<AdminTeamRow["role"], string> = {
  SUPER_ADMIN: "bg-brand-navy/15 text-brand-navy",
  ADMIN: "bg-brand-sky/15 text-brand-ocean",
  EDITOR: "bg-brand-teal/15 text-[#0e7a59]",
  CONSULTANT: "bg-brand-amber/15 text-[#8a5710]",
  VIEWER: "bg-brand-slate/15 text-brand-charcoal"
};

export function TeamTable({
  rows,
  currentUserId,
  currentUserRole
}: {
  rows: AdminTeamRow[];
  currentUserId?: string;
  currentUserRole?: AdminTeamRow["role"];
}) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminTeamRow | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Reveal state for the most-recently-generated temp password (invite or reset).
  const [reveal, setReveal] = useState<{
    email: string;
    password: string;
    variant: "invite" | "reset";
  } | null>(null);

  const canChangeRoles = currentUserRole === "SUPER_ADMIN";

  function onRoleChange(row: AdminTeamRow, role: AdminTeamRow["role"]) {
    if (role === row.role) return;
    setPendingId(row.id);
    setError(null);
    startTransition(async () => {
      const res = await changeRole(row.id, role);
      if (!res.ok) setError(res.error);
      setPendingId(null);
    });
  }

  function onToggleActive(row: AdminTeamRow) {
    setPendingId(row.id);
    setError(null);
    startTransition(async () => {
      const res = await setMemberActive(row.id, !row.active);
      if (!res.ok) setError(res.error);
      setPendingId(null);
    });
  }

  function onResetPassword(row: AdminTeamRow) {
    if (!confirm(`Reset password for ${row.name}? They will need the new one to sign in.`)) {
      return;
    }
    setPendingId(row.id);
    setError(null);
    startTransition(async () => {
      const res = await resetMemberPassword(row.id);
      if (res.ok && res.tempPassword) {
        setReveal({ email: row.email, password: res.tempPassword, variant: "reset" });
      } else if (!res.ok) {
        setError(res.error);
      }
      setPendingId(null);
    });
  }

  return (
    <div className="space-y-4">
      {reveal && (
        <TempPasswordReveal
          email={reveal.email}
          password={reveal.password}
          variant={reveal.variant}
          onDismiss={() => setReveal(null)}
        />
      )}

      {error && (
        <p className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2" role="alert">
          {error}
        </p>
      )}

      <div className="bg-white border border-[#E6F1FB] rounded-card shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#E6F1FB]">
          <div>
            <h2 className="text-base font-semibold text-brand-navy">Team members</h2>
            <p className="text-xs text-brand-slate">
              {rows.length} total · {rows.filter((r) => r.active).length} active
            </p>
          </div>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="h-9 px-3 rounded-lg bg-brand-navy text-white text-sm font-medium"
          >
            + Invite
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-ice text-brand-navy">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Last login</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6F1FB]">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-brand-slate">
                    No team members yet. Click <em>Invite</em> to add the first one.
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const isSelf = r.id === currentUserId;
                  const busy = pendingId === r.id;
                  return (
                    <tr key={r.id} className="hover:bg-brand-cream/60">
                      <td className="px-4 py-3 font-medium text-brand-charcoal">
                        <button
                          type="button"
                          onClick={() => setEditTarget(r)}
                          className="text-left hover:text-brand-navy hover:underline"
                        >
                          {r.name}
                          {isSelf && (
                            <span className="ml-2 text-xs uppercase tracking-widest text-brand-slate">
                              (you)
                            </span>
                          )}
                        </button>
                        {r.specialisations && (
                          <p className="text-xs text-brand-slate mt-0.5 line-clamp-1">
                            {r.specialisations}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-brand-slate font-mono text-xs">{r.email}</td>
                      <td className="px-4 py-3">
                        {canChangeRoles && !isSelf ? (
                          <select
                            value={r.role}
                            disabled={busy}
                            onChange={(e) =>
                              onRoleChange(r, e.target.value as AdminTeamRow["role"])
                            }
                            className="h-8 px-2 rounded-md border border-[#C8D8EA] text-xs bg-white"
                          >
                            {(
                              [
                                "SUPER_ADMIN",
                                "ADMIN",
                                "EDITOR",
                                "CONSULTANT",
                                "VIEWER"
                              ] as const
                            ).map((rl) => (
                              <option key={rl} value={rl}>
                                {ROLE_LABEL[rl]}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-pill text-xs font-medium ${ROLE_TONE[r.role]}`}
                          >
                            {ROLE_LABEL[r.role]}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-brand-slate">{r.lastLoginLabel}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-pill text-xs font-medium ${
                            r.active
                              ? "bg-brand-teal/15 text-[#0e7a59]"
                              : "bg-brand-slate/15 text-brand-charcoal"
                          }`}
                        >
                          {r.active ? "Active" : "Deactivated"}
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
                          onClick={() => onResetPassword(r)}
                          disabled={busy}
                          className="h-8 px-3 rounded-md border border-[#C8D8EA] text-brand-navy text-xs hover:bg-brand-ice disabled:opacity-60"
                        >
                          Reset PW
                        </button>
                        {!isSelf && (
                          <button
                            type="button"
                            onClick={() => onToggleActive(r)}
                            disabled={busy}
                            className={`h-8 px-3 rounded-md text-xs ${
                              r.active
                                ? "border border-brand-amber text-[#8a5710] hover:bg-brand-amber/10"
                                : "bg-brand-teal text-white hover:bg-[#178463]"
                            } disabled:opacity-60`}
                          >
                            {r.active ? "Deactivate" : "Reactivate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InviteMemberDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvited={(email, tempPassword) =>
          setReveal({ email, password: tempPassword, variant: "invite" })
        }
        currentUserRole={currentUserRole}
      />
      <EditProfileDialog
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        initial={editTarget}
      />
    </div>
  );
}
