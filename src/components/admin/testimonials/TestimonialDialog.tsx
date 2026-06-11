"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  createTestimonial,
  updateTestimonial
} from "@/lib/actions/testimonials";

export type TestimonialFormValue = {
  id?: string;
  studentName: string;
  originCountry: string;
  destinationCty: string;
  destinationUni: string;
  programme: string;
  graduationYear: string;
  serviceType: "Admissions" | "Test Prep" | "Counselling" | "Visa" | "Corporate";
  quote: string;
  fullStory: string;
  photoUrl: string;
  videoUrl: string;
  featured: boolean;
};

const ORIGIN_COUNTRIES = [
  "Ghana",
  "Nigeria",
  "Côte d'Ivoire",
  "Togo",
  "Burkina Faso",
  "Liberia",
  "Other"
];

const DESTINATIONS = [
  "United Kingdom",
  "Canada",
  "United States",
  "Australia",
  "Germany",
  "Türkiye",
  "Malaysia"
];

const SERVICE_TYPES: TestimonialFormValue["serviceType"][] = [
  "Admissions",
  "Test Prep",
  "Counselling",
  "Visa",
  "Corporate"
];

export function TestimonialDialog({
  mode,
  open,
  onClose,
  initial
}: {
  mode: "create" | "edit";
  open: boolean;
  onClose: () => void;
  initial?: TestimonialFormValue;
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
          ? await createTestimonial(formData)
          : await updateTestimonial(initial!.id!, formData);
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
        <header className="px-6 py-4 border-b border-[#E6F1FB] flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-brand-navy">
            {mode === "create" ? "Add success story" : "Edit success story"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-brand-slate hover:text-brand-charcoal text-2xl leading-none"
          >
            ×
          </button>
        </header>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <Field
            label="Student name"
            name="studentName"
            required
            defaultValue={initial?.studentName}
            placeholder="Akosua Mensah"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldSelect
              label="Origin country"
              name="originCountry"
              required
              defaultValue={initial?.originCountry ?? ""}
              options={ORIGIN_COUNTRIES}
            />
            <FieldSelect
              label="Destination country"
              name="destinationCty"
              required
              defaultValue={initial?.destinationCty ?? ""}
              options={DESTINATIONS}
            />
          </div>

          <Field
            label="Destination university"
            name="destinationUni"
            required
            defaultValue={initial?.destinationUni}
            placeholder="University of Manchester"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Field
                label="Programme"
                name="programme"
                required
                defaultValue={initial?.programme}
                placeholder="MSc Public Health"
              />
            </div>
            <Field
              label="Year"
              name="graduationYear"
              type="number"
              defaultValue={initial?.graduationYear ?? ""}
              placeholder="2025"
            />
          </div>

          <FieldSelect
            label="Service category"
            name="serviceType"
            required
            defaultValue={initial?.serviceType ?? "Admissions"}
            options={SERVICE_TYPES}
          />

          <FieldTextarea
            label="Quote (2-3 sentences shown on cards)"
            name="quote"
            required
            rows={3}
            maxLength={800}
            defaultValue={initial?.quote}
          />

          <FieldTextarea
            label="Full story (optional, longer narrative)"
            name="fullStory"
            rows={4}
            maxLength={8000}
            defaultValue={initial?.fullStory ?? ""}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Photo URL"
              name="photoUrl"
              type="url"
              defaultValue={initial?.photoUrl ?? ""}
              placeholder="https://…/student.jpg"
            />
            <Field
              label="Video URL (YouTube / Vimeo)"
              name="videoUrl"
              type="url"
              defaultValue={initial?.videoUrl ?? ""}
              placeholder="https://youtube.com/watch?v=…"
            />
          </div>

          <label className="flex items-start gap-3 p-4 border border-[#C8D8EA] rounded-lg cursor-pointer hover:bg-brand-ice">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={initial?.featured ?? false}
              className="mt-1 h-5 w-5 rounded border-brand-slate text-brand-navy focus:ring-brand-sky"
            />
            <span>
              <span className="block font-semibold text-brand-navy text-sm">
                Feature on homepage
              </span>
              <span className="block text-xs text-brand-slate mt-0.5">
                Featured stories appear in the rotating carousel on the homepage hero (spec §5.9).
              </span>
            </span>
          </label>

          {error && (
            <p
              role="alert"
              className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2"
            >
              {error}
            </p>
          )}
        </div>

        <footer className="px-6 py-4 bg-brand-cream border-t border-[#E6F1FB] flex justify-end gap-3 sticky bottom-0">
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
              ? "Create story"
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
        {defaultValue === "" && <option value="">Select…</option>}
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
  maxLength,
  defaultValue
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
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
        maxLength={maxLength}
        defaultValue={defaultValue}
        className="block w-full px-3 py-2 rounded-lg border border-[#C8D8EA] bg-white text-sm focus:border-brand-navy outline-none"
      />
    </label>
  );
}
