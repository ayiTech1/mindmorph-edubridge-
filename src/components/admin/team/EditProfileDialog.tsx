"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { updateTeamProfile } from "@/lib/actions/team";

export type TeamProfileValue = {
  id: string;
  name: string;
  bio: string;
  photoUrl: string;
  specialisations: string;
  languages: string;
};

export function EditProfileDialog({
  open,
  onClose,
  initial
}: {
  open: boolean;
  onClose: () => void;
  initial: TeamProfileValue | null;
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
    if (!initial) return;
    setError(null);
    startTransition(async () => {
      const res = await updateTeamProfile(initial.id, formData);
      if (res.ok) onClose();
      else setError(res.error);
    });
  }

  return (
    <dialog
      ref={ref}
      onCancel={onCancel}
      className="rounded-card backdrop:bg-brand-navy/60 p-0 w-full max-w-lg"
    >
      <form action={onSubmit} className="bg-white">
        <header className="px-6 py-4 border-b border-[#E6F1FB] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-navy">Edit profile</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-brand-slate hover:text-brand-charcoal text-2xl leading-none"
          >
            ×
          </button>
        </header>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <Field label="Full name" name="name" required defaultValue={initial?.name} />
          <Field
            label="Photo URL"
            name="photoUrl"
            type="url"
            defaultValue={initial?.photoUrl}
            placeholder="https://…/photo.jpg"
          />
          <FieldTextarea
            label="Bio"
            name="bio"
            rows={4}
            defaultValue={initial?.bio}
            placeholder="One paragraph — appears on the public Team page."
          />
          <Field
            label="Specialisations (comma-separated)"
            name="specialisations"
            defaultValue={initial?.specialisations}
            placeholder="UK admissions, Scholarships, Doctoral pathways"
          />
          <Field
            label="Languages (comma-separated)"
            name="languages"
            defaultValue={initial?.languages}
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
            {pending ? "Saving…" : "Save profile"}
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
  defaultValue,
  placeholder
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={fieldClass}
      />
    </label>
  );
}

function FieldTextarea({
  label,
  name,
  rows = 3,
  defaultValue,
  placeholder
}: {
  label: string;
  name: string;
  rows?: number;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[13px] font-semibold text-brand-charcoal">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="block w-full px-3 py-2 rounded-lg border border-[#C8D8EA] bg-white text-sm focus:border-brand-navy outline-none"
      />
    </label>
  );
}
