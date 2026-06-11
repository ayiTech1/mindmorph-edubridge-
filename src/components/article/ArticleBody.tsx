import { LinkButton } from "@/components/ui/Button";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

/**
 * Renders an article body with two contextual CTAs (at ~40% and ~80% scroll
 * positions) and an inline newsletter capture at ~60%, per spec §4.6.
 *
 * Body is plain Markdown-ish text; sufficient for launch articles.
 * In Phase 2 the body comes from Sanity Portable Text — swap this renderer
 * and the insertion points carry over.
 */
export function ArticleBody({ body, category }: { body: string; category: string }) {
  const blocks = body.split("\n\n");
  const cta40 = Math.floor(blocks.length * 0.4);
  const news60 = Math.floor(blocks.length * 0.6);
  const cta80 = Math.floor(blocks.length * 0.8);

  return (
    <div className="prose-body">
      {blocks.map((block, i) => (
        <Block key={i} index={i} block={block} cta40={cta40} news60={news60} cta80={cta80} category={category} />
      ))}
    </div>
  );
}

function Block({
  index,
  block,
  cta40,
  news60,
  cta80,
  category
}: {
  index: number;
  block: string;
  cta40: number;
  news60: number;
  cta80: number;
  category: string;
}) {
  return (
    <>
      {renderBlock(block, index)}
      {index === cta40 && <InlineCTA tone="navy" />}
      {index === news60 && <InlineNewsletter segment={category} />}
      {index === cta80 && <InlineCTA tone="ice" />}
    </>
  );
}

function renderBlock(block: string, i: number) {
  if (block.startsWith("## ")) {
    return (
      <h2 key={i} className="mt-10 mb-3 text-2xl font-bold text-brand-navy">
        {block.replace(/^##\s+/, "")}
      </h2>
    );
  }
  if (block.startsWith("- ")) {
    return (
      <ul key={i} className="list-disc pl-6 my-4 space-y-1">
        {block.split("\n").map((li, idx) => (
          <li key={idx}>{li.replace(/^-\s+/, "")}</li>
        ))}
      </ul>
    );
  }
  return (
    <p key={i} className="my-4">
      {block}
    </p>
  );
}

function InlineCTA({ tone }: { tone: "navy" | "ice" }) {
  const isNavy = tone === "navy";
  return (
    <aside
      className={`not-prose my-10 rounded-card p-6 md:p-8 ${
        isNavy
          ? "bg-brand-navy text-white"
          : "bg-brand-ice border border-brand-sky/30 text-brand-charcoal"
      }`}
    >
      <p className={`text-sm uppercase tracking-widest ${isNavy ? "text-brand-sky" : "text-brand-ocean"}`}>
        Need help applying?
      </p>
      <p className={`mt-2 text-xl md:text-2xl font-bold ${isNavy ? "text-white" : "text-brand-navy"}`}>
        Get a free 30-minute consultation with a specialist.
      </p>
      <div className="mt-5">
        <LinkButton href="/book" variant={isNavy ? "ghost" : "primary"}>
          Book your free consultation
        </LinkButton>
      </div>
    </aside>
  );
}

function InlineNewsletter({ segment }: { segment: string }) {
  return (
    <aside className="not-prose my-10 rounded-card border border-[#C8D8EA] bg-white p-6 md:p-8">
      <p className="text-sm uppercase tracking-widest text-brand-ocean">Stay in the loop</p>
      <p className="mt-2 text-xl font-bold text-brand-navy">
        Get monthly scholarship updates — no spam, ever.
      </p>
      <div className="mt-5">
        <NewsletterForm segment={segment.toLowerCase()} />
      </div>
    </aside>
  );
}
