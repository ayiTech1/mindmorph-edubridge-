import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Mindmorph wordmark + monogram.
 *
 * - `variant="dark"` (default) — for use on light/cream backgrounds.
 *   Navy rounded square with white `M` and sky-blue accent dot.
 * - `variant="light"` — for use on dark navy backgrounds (footer, hero overlay).
 *   White rounded square with navy `M` and sky-blue accent dot, white text.
 *   (The previous version rendered a white `M` on a white square — invisible.)
 */
export function Logo({
  variant = "dark",
  className
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const isDark = variant === "dark";
  const markBg = isDark ? "#0C447C" : "#FFFFFF";
  const markLetter = isDark ? "#FFFFFF" : "#0C447C";
  const textColor = isDark ? "#0C447C" : "#FFFFFF";

  return (
    <Link
      href="/"
      aria-label="Mindmorph Edubridge home"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="2" y="2" width="32" height="32" rx="9" fill={markBg} />
        <path
          d="M9 24V12h3l5 7 5-7h3v12h-3v-7l-4 5.5h-2L12 17v7H9Z"
          fill={markLetter}
        />
        <circle cx="28" cy="9" r="2.4" fill="#378ADD" />
      </svg>
      <span
        className="font-bold leading-tight tracking-tight"
        style={{ color: textColor }}
      >
        <span className="block text-[15px]">Mindmorph</span>
        <span className="block text-[11px] font-medium tracking-[0.18em] uppercase opacity-80">
          Edubridge
        </span>
      </span>
    </Link>
  );
}
