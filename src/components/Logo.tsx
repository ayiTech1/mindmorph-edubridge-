import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Wordmark plus a mark built from two overlapping shapes — the "morph".
 * `tone` switches it for the dark footer without a second component.
 */
export default function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const isLight = tone === "light";

  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-navy-700 to-navy-950 shadow-md shadow-navy-900/25">
        <span className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-gold-500/85 blur-[1px] transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1" />
        <svg viewBox="0 0 24 24" className="relative h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 9.5 12 4.5 2 9.5l10 5 10-5Z" />
          <path d="M6 11.7v4.6c0 1.6 2.7 3.2 6 3.2s6-1.6 6-3.2v-4.6" />
        </svg>
      </span>
      <span className="leading-none">
        <span className={`block font-display text-[1.05rem] font-extrabold tracking-tight ${isLight ? "text-white" : "text-navy-900"}`}>
          MIND<span className="text-gold-500">MORPH</span>
        </span>
        <span className={`mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.26em] ${isLight ? "text-navy-200" : "text-navy-400"}`}>
          EduBridge
        </span>
      </span>
    </Link>
  );
}
