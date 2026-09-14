/** One heading block, so no section can drift on type scale or spacing. */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "dark",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
}) {
  const centered = align === "center";
  const light = tone === "light";

  return (
    <div className={`${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      {eyebrow ? (
        light ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-400">
            {eyebrow}
          </span>
        ) : (
          <span className="eyebrow">{eyebrow}</span>
        )
      ) : null}

      <h2
        className={`mt-5 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.6rem] ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>

      {subtitle ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            light ? "text-navy-100/80" : "text-navy-600"
          } ${centered ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
