"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckIcon, WhatsAppIcon } from "./icons";
import { whatsappLink } from "@/lib/site";
import {
  APPLICANT_TYPES,
  CURRICULUM_OPTIONS,
  LEVEL_OPTIONS,
  STUDY_MODES,
  SUBJECT_OPTIONS,
  applicationAsWhatsAppText,
  emptyApplication,
  validateApplication,
  type ApplicationFields,
  type FieldErrors,
} from "@/lib/application";

type Status = "idle" | "sending" | "sent" | "error";

export default function ApplicationForm() {
  const [data, setData] = useState<ApplicationFields>(emptyApplication);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const isForChild = data.applicantType === APPLICANT_TYPES[0];

  /**
   * The WhatsApp route carries whatever has been typed so far, so a visitor who
   * would rather chat never has to retype what they already filled in.
   */
  const whatsappHref = useMemo(() => whatsappLink(applicationAsWhatsAppText(data)), [data]);

  function set<K extends keyof ApplicationFields>(key: K, value: ApplicationFields[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    // Clear a field's error the moment the visitor starts fixing it.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  function toggleSubject(subject: string) {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
    setErrors((prev) => (prev.subjects ? { ...prev, subjects: undefined } : prev));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    const found = validateApplication(data);
    if (Object.keys(found).length) {
      setErrors(found);
      setStatus("error");
      document.querySelector<HTMLElement>("[data-invalid='true']")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        setErrors(result.errors ?? {});
        setServerError(result.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setServerError(
        "We couldn't reach our server. Please check your connection, or send your details on WhatsApp.",
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl border border-whatsapp/25 bg-whatsapp/5 p-10 text-center sm:p-14">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-whatsapp text-white">
          <CheckIcon className="h-8 w-8" />
        </span>
        <h2 className="mt-7 font-display text-2xl font-extrabold sm:text-3xl">
          Application received.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-navy-600">
          Thank you — your details are with our team. We&apos;ll be in touch within{" "}
          <strong className="text-navy-900">24 hours</strong> to schedule your free 30-minute
          assessment.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Message us now for a faster reply
          </a>
          <Link href="/" className="btn-outline">
            Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-9">
      {/* Honeypot — hidden from people and from screen readers, visible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={data.company}
          onChange={(e) => set("company", e.target.value)}
        />
      </div>

      {/* --- Who is applying --------------------------------------------- */}
      <Fieldset legend="Who is this for?" step="1">
        <div className="grid gap-3 sm:grid-cols-2">
          {APPLICANT_TYPES.map((type) => (
            <Choice
              key={type}
              name="applicantType"
              label={type}
              checked={data.applicantType === type}
              onChange={() => set("applicantType", type)}
            />
          ))}
        </div>
      </Fieldset>

      {/* --- Contact details --------------------------------------------- */}
      <Fieldset legend="Your details" step="2">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="fullName"
            label={isForChild ? "Parent / Guardian full name" : "Your full name"}
            required
            error={errors.fullName}
          >
            <input
              id="fullName"
              className="field"
              autoComplete="name"
              placeholder="e.g. Ama Mensah"
              value={data.fullName}
              onChange={(e) => set("fullName", e.target.value)}
            />
          </Field>

          {isForChild ? (
            <Field id="studentName" label="Student's full name" required error={errors.studentName}>
              <input
                id="studentName"
                className="field"
                placeholder="e.g. Kwabena Mensah"
                value={data.studentName}
                onChange={(e) => set("studentName", e.target.value)}
              />
            </Field>
          ) : null}

          <Field id="email" label="Email address" required error={errors.email}>
            <input
              id="email"
              type="email"
              inputMode="email"
              className="field"
              autoComplete="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>

          <Field
            id="phone"
            label="Phone / WhatsApp number"
            required
            error={errors.phone}
            hint="Include the country code, e.g. +233"
          >
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              className="field"
              autoComplete="tel"
              placeholder="+233 00 000 0000"
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
        </div>
      </Fieldset>

      {/* --- Programme ---------------------------------------------------- */}
      <Fieldset legend="What do you need?" step="3">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="level" label="Current level" required error={errors.level}>
            <select
              id="level"
              className="field"
              value={data.level}
              onChange={(e) => set("level", e.target.value)}
            >
              <option value="">Select a level…</option>
              {LEVEL_OPTIONS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </Field>

          <Field id="curriculum" label="Curriculum / exam board" required error={errors.curriculum}>
            <select
              id="curriculum"
              className="field"
              value={data.curriculum}
              onChange={(e) => set("curriculum", e.target.value)}
            >
              <option value="">Select a curriculum…</option>
              {CURRICULUM_OPTIONS.map((curriculum) => (
                <option key={curriculum} value={curriculum}>
                  {curriculum}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-6" data-invalid={errors.subjects ? "true" : undefined}>
          <p className="field-label">
            Subjects needed <span className="text-gold-600">*</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {SUBJECT_OPTIONS.map((subject) => {
              const selected = data.subjects.includes(subject);
              return (
                <button
                  key={subject}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleSubject(subject)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selected
                      ? "border-navy-900 bg-navy-900 text-white shadow-md shadow-navy-900/20"
                      : "border-navy-200 bg-white text-navy-600 hover:border-navy-400 hover:bg-navy-50"
                  }`}
                >
                  {subject}
                </button>
              );
            })}
          </div>
          {errors.subjects ? <ErrorText>{errors.subjects}</ErrorText> : null}
        </div>
      </Fieldset>

      {/* --- Preferences -------------------------------------------------- */}
      <Fieldset legend="How would you like to learn?" step="4">
        <div className="grid gap-3 sm:grid-cols-3">
          {STUDY_MODES.map((mode) => (
            <Choice
              key={mode}
              name="mode"
              label={mode}
              checked={data.mode === mode}
              onChange={() => set("mode", mode)}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-5">
          <Field
            id="preferredSchedule"
            label="Preferred days & times"
            hint="Optional — e.g. weekday evenings, Saturday mornings"
          >
            <input
              id="preferredSchedule"
              className="field"
              placeholder="Weekday evenings after 5pm"
              value={data.preferredSchedule}
              onChange={(e) => set("preferredSchedule", e.target.value)}
            />
          </Field>

          <Field id="message" label="Anything else we should know?" hint="Optional">
            <textarea
              id="message"
              rows={4}
              className="field resize-y"
              placeholder="Target grade, upcoming exam date, areas of difficulty…"
              value={data.message}
              onChange={(e) => set("message", e.target.value)}
            />
          </Field>
        </div>
      </Fieldset>

      {serverError ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-relaxed text-red-800"
        >
          {serverError}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-navy-100 pt-8 sm:flex-row">
        <button type="submit" className="btn-primary flex-1" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Sending…
            </>
          ) : (
            "Submit Application"
          )}
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp flex-1"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Apply on WhatsApp Instead
        </a>
      </div>

      <p className="text-center text-xs leading-relaxed text-navy-400">
        Your details are emailed straight to our admissions team and used only to arrange your
        assessment. We never share them.
      </p>
    </form>
  );
}

/* --------------------------------------------------------------------------
   Small presentational pieces, kept local — nothing else on the site uses them.
-------------------------------------------------------------------------- */

function Fieldset({
  legend,
  step,
  children,
}: {
  legend: string;
  step: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-navy-100 bg-white p-6 sm:p-8">
      <legend className="flex items-center gap-3 px-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy-900 font-display text-xs font-bold text-gold-400">
          {step}
        </span>
        <span className="font-display text-base font-bold text-navy-900">{legend}</span>
      </legend>
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-invalid={error ? "true" : undefined}>
      <label htmlFor={id} className="field-label">
        {label} {required ? <span className="text-gold-600">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="mt-1.5 text-xs text-navy-400">{hint}</p> : null}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
      {children}
    </p>
  );
}

function Choice({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
        checked
          ? "border-navy-900 bg-navy-50 text-navy-900"
          : "border-navy-200 bg-white text-navy-600 hover:border-navy-400"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
          checked ? "border-navy-900 bg-navy-900" : "border-navy-200"
        }`}
      >
        {checked ? <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> : null}
      </span>
      {label}
    </label>
  );
}
