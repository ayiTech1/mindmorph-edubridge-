"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { inviteTeamMember } from "@/lib/actions/team";

const ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "EDITOR", label: "Editor" },
  { value: "CONSULTANT", label: "Consultant" },
  { value: "VIEWER", label: "Viewer" }
];

export function InviteMemberDialog({
  open,
  onClose,
  onInvited,
  currentUserRole
}: {
  open: boolean;
  onClose: () => void;
  onInvited: (email: string, tempPassword: string) => void;
  currentUserRole?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      setError(null);
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function onCancel(e: React.SyntheticEvent<HTMLDialogElement>) {
    e.preventDefault();
    onClose();
  }

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await inviteTeamMember(formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      onInvited(String(formData.get("email") || ""), res.tempPassword ?? "");
      onClose();
    });
  }

  // Hide SUPER_ADMIN from the dropdown unless the inviter is one.
  const visibleRoles =
    currentUserRole === "SUPER_ADMIN" ? ROLES : ROLES.filter((r) => r.value !== "SUPER_ADMIN");

  return (
    <dialog
      ref={ref}
      onCancel={onCancel}
      className="rounded-card backdrop:bg-brand-navy/60 p-0 w-full max-w-lg"
    >
      <form action={onSubmit} className="bg-white">
        <header className="px-6 py-4 border-b border-[#E6F1FB] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-navy">Invite a team member</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-brand-slate hover:text-brand-charcoal text-2xl leading-none"
          >
            ×
          </button>
        </header>

        <div className="p-6 space-y-4">
          <Field label="Full name" name="name" required placeholder="Akua Boateng" />
          <Field
            label="Work email"
            name="email"
            type="email"
            required
            placeholder="akua@mindmorphedubridge.com"
          />
          <FieldSelect
            label="Role"
            name="role"
            defaultValue="CONSULTANT"
            options={visibleRoles}
          />
          <Field
            label="Specialisations (optional, comma-separated)"
            name="specialisations"
            placeholder="UK admissions, Scholarships, Doctoral pathways"
          />
          <Field
            label="Languages (optional, comma-separated)"
            name="languages"
            placeholder="English, French, Twi"
          />

          {error && (
            <p
              role="alert"
              className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2"
            >
              {error}
            </p>
          )}

          <p className="text-xs text-brand-slate">
            We&apos;ll generate a one-time password for you to share with them on first sign-in.
          </p>
        </div>

        <footer className="px-6 py-4 bg-brand-cream border-t border-[#E6F1FB] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="h-10 px-4 rounded-lg border border-[#C8D8EA] text-sm text-brand-charcoal hover:bg-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="h-10 px-5 rounded-lg bg-brand-navy text-white text-sm font-medium disabled:opacity-60"
          >
            {pending ? "Inviting…" : "Send invite"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}

const fieldClass =
  "block w-full h-11 px-3 rounded-lg border border-[#C8D8EA] bg-white text-sm focus:border-brand-navy outline-none";

function Field({
  label,
  name,
  required,
  type = "text",
  placeholder
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[13px] font-semibold text-brand-charcoal">
        {label}
        {required && <span className="text-brand-amber"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={fieldClass}
      />
    </label>
  );
}

function FieldSelect({
  label,
  name,
  defaultValue,
  options
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[13px] font-semibold text-brand-charcoal">{label}</span>
      <select name={name} defaultValue={defaultValue} className={fieldClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
