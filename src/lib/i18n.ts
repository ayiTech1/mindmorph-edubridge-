// Minimal i18n scaffold. Spec §6.5 — phase 1 ships English; French toggle reserved
// for top 5 pages. We persist locale via cookie and prefix French URLs with /fr.

export type Locale = "en" | "fr";
export const locales: Locale[] = ["en", "fr"];
export const defaultLocale: Locale = "en";

export const localeLabel: Record<Locale, string> = {
  en: "English",
  fr: "Français"
};
