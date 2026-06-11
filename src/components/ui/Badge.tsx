import { cn } from "@/lib/utils";

type Tone = "navy" | "sky" | "teal" | "amber" | "slate";

const tones: Record<Tone, string> = {
  navy: "bg-brand-navy/10 text-brand-navy",
  sky: "bg-brand-sky/15 text-brand-ocean",
  teal: "bg-brand-teal/15 text-[#0e7a59]",
  amber: "bg-brand-amber/15 text-[#8a5710]",
  slate: "bg-brand-slate/15 text-brand-charcoal"
};

export function Badge({
  tone = "sky",
  className,
  children
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
