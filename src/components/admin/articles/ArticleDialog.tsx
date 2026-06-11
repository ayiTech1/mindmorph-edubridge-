"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createArticle, updateArticle } from "@/lib/actions/articles";

export type ArticleFormValue = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  tags: string;
  excerpt: string;
  body: string;
  featuredImage: string;
  metaTitle: string;
  metaDesc: string;
  ogImage: string;
  author: string;
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
};

const CATEGORIES = [
  "Admissions",
  "Scholarships",
  "Visa guides",
  "Test prep",
  "Destination guides",
  "Career advice"
];

const STATUSES: Array<ArticleFormValue["status"]> = [
  "DRAFT",
  "REVIEW",
  "PUBLISHED",
  "ARCHIVED"
];

export function ArticleDialog({
  mode,
  open,
  onClose,
  initial
}: {
  mode: "create" | "edit";
  open: boolean;
  onClose: () => void;
  initial?: ArticleFormValue;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState(initial?.body ?? "");

  useEffect(() => {
    setBody(initial?.body ?? "");
  }, [initial]);

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
          ? await createArticle(formData)
          : await updateArticle(initial!.id!, formData);
      if (res.ok) onClose();
      else setError(res.error);
    });
  }

  const wordCount = useMemo(
    () => body.trim().split(/\s+/).filter(Boolean).length,
    [body]
  );
  const readMinutes = Math.max(1, Math.ceil(wordCount / 220));

  return (
    <dialog
      ref={ref}
      onCancel={onCancel}
      className="rounded-card backdrop:bg-brand-navy/60 p-0 w-full max-w-4xl"
    >
      <form action={onSubmit} className="bg-white">
        <header className="px-6 py-4 border-b border-[#E6F1FB] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-semibold text-brand-navy">
              {mode === "create" ? "New article" : "Edit article"}
            </h2>
            <p className="text-xs text-brand-slate">
              {wordCount} words · ~{readMinutes} min read
            </p>
          </div>
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
            label="Title"
            name="title"
            required
            defaultValue={initial?.title}
            placeholder="How to apply to UK universities from Ghana"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Slug"
              name="slug"
              defaultValue={initial?.slug ?? ""}
              placeholder="auto-generated from title if blank"
            />
            <FieldSelect
              label="Category"
              name="category"
              required
              defaultValue={initial?.category ?? ""}
              options={CATEGORIES}
            />
          </div>
          <Field
            label="Tags (comma-separated)"
            name="tags"
            defaultValue={initial?.tags ?? ""}
            placeholder="UK, UCAS, WASSCE"
          />
          <FieldTextarea
            label="Excerpt"
            name="excerpt"
            required
            rows={3}
            maxLength={600}
            defaultValue={initial?.excerpt}
          />

          {/* Body editor + live preview */}
          <div>
            <span className="text-[13px] font-semibold text-brand-charcoal">
              Body <span className="text-brand-amber">*</span>
              <span className="text-xs font-normal text-brand-slate ml-2">
                Markdown supported (## headings, paragraphs, - bullets)
              </span>
            </span>
            <div className="mt-1.5 grid grid-cols-1 lg:grid-cols-2 gap-3">
              <textarea
                name="body"
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={16}
                className="block w-full px-3 py-2 rounded-lg border border-[#C8D8EA] bg-white font-mono text-sm leading-relaxed focus:border-brand-navy outline-none"
              />
              <BodyPreview source={body} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Featured image URL"
              name="featuredImage"
              type="url"
              defaultValue={initial?.featuredImage ?? ""}
              placeholder="https://images.unsplash.com/…"
            />
            <Field
              label="Author"
              name="author"
              required
              defaultValue={initial?.author ?? ""}
              placeholder="Mindmorph Admissions Team"
            />
          </div>

          <details className="border border-[#E6F1FB] rounded-lg p-3">
            <summary className="text-sm font-semibold text-brand-navy cursor-pointer">
              SEO overrides (optional)
            </summary>
            <div className="mt-4 space-y-3">
              <Field
                label="Meta title"
                name="metaTitle"
                defaultValue={initial?.metaTitle ?? ""}
                placeholder="defaults to the article title"
              />
              <FieldTextarea
                label="Meta description"
                name="metaDesc"
                rows={2}
                maxLength={180}
                defaultValue={initial?.metaDesc ?? ""}
                placeholder="defaults to the excerpt"
              />
              <Field
                label="Open Graph image URL"
                name="ogImage"
                type="url"
                defaultValue={initial?.ogImage ?? ""}
                placeholder="defaults to the featured image"
              />
            </div>
          </details>

          <FieldSelect
            label="Status"
            name="status"
            defaultValue={initial?.status ?? "DRAFT"}
            options={STATUSES}
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
              ? "Create article"
              : "Save changes"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}

function BodyPreview({ source }: { source: string }) {
  return (
    <div className="bg-brand-cream rounded-lg p-4 h-[400px] overflow-y-auto text-sm leading-relaxed text-brand-charcoal">
      {source.trim() === "" ? (
        <p className="text-brand-slate italic">
          Live preview appears here as you type.
        </p>
      ) : (
        source.split("\n\n").map((block, i) => {
          if (block.startsWith("## ")) {
            return (
              <h3 key={i} className="mt-4 mb-2 text-base font-bold text-brand-navy">
                {block.replace(/^##\s+/, "")}
              </h3>
            );
          }
          if (block.startsWith("- ")) {
            return (
              <ul key={i} className="list-disc pl-5 my-2 space-y-1">
                {block.split("\n").map((li, idx) => (
                  <li key={idx}>{li.replace(/^-\s+/, "")}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} className="my-2">
              {block}
            </p>
          );
        })
      )}
    </div>
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
        {!required && defaultValue === "" && <option value="">Select…</option>}
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
  defaultValue,
  placeholder
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  defaultValue?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        className="block w-full px-3 py-2 rounded-lg border border-[#C8D8EA] bg-white text-sm focus:border-brand-navy outline-none"
      />
    </label>
  );
}
