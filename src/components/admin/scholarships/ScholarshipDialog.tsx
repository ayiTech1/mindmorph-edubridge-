"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createScholarship, updateScholarship } from "@/lib/actions/scholarships";

export type ScholarshipFormValue = {
  id?: string;
  name: string;
  destination: string;
  level: string;
  subjectArea: string;
  awardValue: string;
  deadline: string; // YYYY-MM-DD
  eligibility: string;
  link: string;
};

const DESTINATIONS = [
  "United Kingdom",
  "Canada",
  "United States",
  "Australia",
  "Germany",
  "Türkiye",
  "Malaysia",
  "Multiple"
];

const LEVELS = [
  "Undergraduate",
  "Master's",
  "Postgraduate",
  "Doctoral",
  "Undergraduate & Postgraduate"
];

export function ScholarshipDialog({
  mode,
  open,
  onClose,
  initial
}: {
  mode: "create" | "edit";
  open: boolean;
  onClose: () => void;
  initial?: ScholarshipFormValue;
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
      const res =
        mode === "create"
          ? await createScholarship(formData)
          : await updateScholarship(initial!.id!, formData);
      if (res.ok) onClose();
      else setError(res.error);
    });
  }

  return (
    <dialog
      ref={ref}
      onCancel={onCancel}
      className="rounded-card backdrop:bg-brand-navy/60 p-0 w-full max-w-2xl"
    >
      <form action={onSubmit} className="bg-white">
        <header className="px-6 py-4 border-b border-[#E6F1FB] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-navy">
            {mode === "create" ? "Add scholarship" : "Edit scholarship"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-brand-slate hover:text-brand-charcoal text-xl"
          >
            ×
          </button>
        </header>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <Field label="Name" name="name" required defaultValue={initial?.name} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldSelect
              label="Destination"
              name="destination"
              required
              defaultValue={initial?.destination ?? ""}
              options={DESTINATIONS}
            />
            <FieldSelect
              label="Level"
              name="level"
              required
              defaultValue={initial?.level ?? ""}
              options={LEVELS}
            />
          </div>
          <Field
            label="Subject area (optional)"
            name="subjectArea"
            defaultValue={initial?.subjectArea ?? ""}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Award value"
              name="awardValue"
              required
              placeholder="e.g. Full tuition + stipend"
              defaultValue={initial?.awardValue}
            />
            <Field
              label="Deadline"
              name="deadline"
              type="date"
              required
              defaultValue={initial?.deadline}
            />
          </div>
          <FieldTextarea
            label="Eligibility"
            name="eligibility"
            required
            rows={4}
            defaultValue={initial?.eligibility}
          />
          <Field
            label="Official link (optional)"
            name="link"
            type="url"
            defaultValue={initial?.link ?? ""}
            placeholder="https://…"
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
            {pending
              ? "Saving…"
              : mode === "create"
              ? "Create scholarship"
              : "Save changes"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}

const fieldClass =
  "block w-full h-11 px-3 rounded-lg border border-[#C8D8EA] bg-white text-sm focus:border-brand-navy outline-none";
const labelClass = "text-[13px] font-semibold text-brand-charcoal";

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
      <span className={labelClass}>
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

function FieldSelect({
  label,
  name,
  required,
  defaultValue,
  options
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  options: string[];
}) {
  return (
    <label className="block space-y-1.5">
      <span className={labelClass}>
        {label}
        {required && <span className="text-brand-amber"> *</span>}
      </span>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className={fieldClass}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function FieldTextarea({
  label,
  name,
  required,
  rows = 3,
  defaultValue
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  defaultValue?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className={labelClass}>
        {label}
        {required && <span className="text-brand-amber"> *</span>}
      </span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        defaultValue={defaultValue}
        className="block w-full px-3 py-2 rounded-lg border border-[#C8D8EA] bg-white text-sm focus:border-brand-navy outline-none"
      />
    </label>
  );
}
