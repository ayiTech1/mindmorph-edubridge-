import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  innerClassName?: string;
  bg?: "default" | "ice" | "navy" | "cream";
  children: React.ReactNode;
}

const bgMap: Record<Required<SectionProps>["bg"], string> = {
  default: "bg-white",
  ice: "bg-brand-ice",
  navy: "bg-brand-navy text-white",
  cream: "bg-brand-cream"
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  className,
  innerClassName,
  bg = "default",
  children
}: SectionProps) {
  const onNavy = bg === "navy";
  return (
    <section id={id} className={cn("py-16 md:py-24", bgMap[bg], className)}>
      <Container className={innerClassName}>
        {(eyebrow || title || description) && (
          <div className="max-w-3xl mb-10 md:mb-14">
            {eyebrow && (
              <p
                className={cn(
                  "uppercase tracking-widest text-xs font-medium mb-3",
                  onNavy ? "text-brand-sky" : "text-brand-ocean"
                )}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                className={cn(
                  "text-3xl md:text-4xl font-bold leading-tight",
                  onNavy && "text-white"
                )}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className={cn(
                  "mt-4 text-lg",
                  onNavy ? "text-brand-ice" : "text-brand-charcoal/80"
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
