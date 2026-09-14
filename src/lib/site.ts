/**
 * Every piece of copy, contact detail and menu entry on the site lives here.
 *
 * Edit this file to change the website's content — the components read from it
 * and never hard-code a phone number, an email address or a section heading.
 *
 * Contact details fall back to placeholders when the matching NEXT_PUBLIC_*
 * environment variable is unset, so the site still builds and runs before the
 * real numbers are known. Replace them in `.env.local` (see `.env.example`).
 */

const env = (key: string, fallback: string) => {
  const value = process.env[key];
  return value && value.trim() ? value.trim() : fallback;
};

/** Digits only, full international format — what wa.me expects. */
const whatsappNumber = env("NEXT_PUBLIC_WHATSAPP_NUMBER", "233000000000");

export const site = {
  name: "MindMorph EduBridge",
  shortName: "MindMorph",
  tagline: "Morphing Minds, Bridging Success.",
  description:
    "Ghana's leading online and in-person tuition centre for international curricula — IGCSE, IB, American Curriculum, Pearson Edexcel, SAT, SSAT, TOEFL and more.",
  url: env("NEXT_PUBLIC_SITE_URL", "https://mindmorphedubridge.com"),

  contact: {
    email: env("NEXT_PUBLIC_CONTACT_EMAIL", "info@mindmorphedubridge.com"),
    phoneDisplay: env("NEXT_PUBLIC_PHONE_DISPLAY", "+233 24 684 2070"),
    phoneDial: env("NEXT_PUBLIC_PHONE_DIAL", "+233246842070"),
    whatsappNumber,
    location: "Accra, Ghana — and online, everywhere.",
  },
} as const;

/**
 * Builds a wa.me deep link that opens WhatsApp with the message pre-typed.
 * Works on mobile (opens the app) and desktop (opens WhatsApp Web).
 */
export function whatsappLink(message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** The pre-filled messages used by each WhatsApp button on the site. */
export const whatsappMessages = {
  general: `Hello ${site.name}! I'd like to know more about your tuition programmes.`,
  trial: `Hello ${site.name}! I'd like to book a FREE 30-minute assessment and trial class.`,
  subject: `Hello ${site.name}! I'm looking for a tutor in a subject I didn't see listed on your website. Could you help?`,
  apply: `Hello ${site.name}! I'd like to apply for tuition. Here are my details:%0A%0AStudent name:%0ACurriculum:%0AGrade / Level:%0ASubjects:`,
} as const;

export const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About Us", href: "/#about" },
  { label: "Programs", href: "/#programs" },
  { label: "Curricula", href: "/#curricula" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Contact", href: "/#contact" },
] as const;
