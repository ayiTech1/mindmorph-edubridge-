/**
 * The application form's shape, validation and rendering.
 *
 * Shared by the client form and the API route deliberately: the browser and the
 * server then agree on exactly which fields are required and what counts as a
 * valid one, so a field added here can never be validated in one place only.
 */

import { curricula, levels, subjects } from "./content";

export const APPLICANT_TYPES = ["For my child", "For myself"] as const;
export const STUDY_MODES = ["Online", "In-Person", "Either is fine"] as const;

export const LEVEL_OPTIONS = levels.map((l) => l.title);
export const CURRICULUM_OPTIONS = [...curricula.map((c) => c.title), "Other / Not sure"];
export const SUBJECT_OPTIONS = [...subjects, "Other"];

export type ApplicationFields = {
  /** Who is filling the form in. */
  applicantType: string;
  fullName: string;
  email: string;
  phone: string;
  /** Left blank when the application is for the person filling it in. */
  studentName: string;
  level: string;
  curriculum: string;
  subjects: string[];
  mode: string;
  preferredSchedule: string;
  message: string;
  /** Honeypot — a real person never sees this field, so a filled one is a bot. */
  company?: string;
};

export const emptyApplication: ApplicationFields = {
  applicantType: APPLICANT_TYPES[0],
  fullName: "",
  email: "",
  phone: "",
  studentName: "",
  level: "",
  curriculum: "",
  subjects: [],
  mode: STUDY_MODES[0],
  preferredSchedule: "",
  message: "",
  company: "",
};

export type FieldErrors = Partial<Record<keyof ApplicationFields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Digits, spaces, +, -, ( ) — 9 to 15 digits once stripped. */
const PHONE_RE = /^[+()\d\s-]{9,20}$/;

export function validateApplication(input: ApplicationFields): FieldErrors {
  const errors: FieldErrors = {};
  const trim = (v: string) => (v ?? "").trim();

  if (trim(input.fullName).length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  if (!EMAIL_RE.test(trim(input.email))) {
    errors.email = "Please enter a valid email address.";
  }

  const digits = trim(input.phone).replace(/\D/g, "");
  if (!PHONE_RE.test(trim(input.phone)) || digits.length < 9) {
    errors.phone = "Please enter a valid phone / WhatsApp number.";
  }

  // Only required when applying on someone else's behalf.
  if (input.applicantType === APPLICANT_TYPES[0] && trim(input.studentName).length < 2) {
    errors.studentName = "Please enter the student's name.";
  }

  if (!trim(input.level)) {
    errors.level = "Please choose a level.";
  }

  if (!trim(input.curriculum)) {
    errors.curriculum = "Please choose a curriculum.";
  }

  if (!input.subjects?.length) {
    errors.subjects = "Please select at least one subject.";
  }

  return errors;
}

/** Field label → value, in the order they should be read. */
export function applicationRows(data: ApplicationFields): Array<[string, string]> {
  const studentName =
    data.applicantType === APPLICANT_TYPES[0] ? data.studentName : data.fullName;

  return [
    ["Applying", data.applicantType],
    ["Contact name", data.fullName],
    ["Student name", studentName],
    ["Email", data.email],
    ["Phone / WhatsApp", data.phone],
    ["Level", data.level],
    ["Curriculum", data.curriculum],
    ["Subjects", data.subjects.join(", ")],
    ["Preferred mode", data.mode],
    ["Preferred schedule", data.preferredSchedule || "—"],
    ["Message", data.message || "—"],
  ];
}

/** The same application, written as a WhatsApp message. */
export function applicationAsWhatsAppText(data: ApplicationFields): string {
  const body = applicationRows(data)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return `Hello MindMorph EduBridge! I'd like to book a free assessment.\n\n${body}`;
}
