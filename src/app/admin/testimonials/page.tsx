import { Topbar } from "@/components/admin/Topbar";
import { TestimonialTable } from "@/components/admin/testimonials/TestimonialTable";
import { getTestimonialsForAdmin } from "@/lib/admin-data";
import { isDbConfigured } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const rows = await getTestimonialsForAdmin();
  const dbReady = isDbConfigured();

  return (
    <>
      <Topbar title="Success stories" />
      <div className="p-6 space-y-6">
        {!dbReady && (
          <div className="bg-brand-amber/10 border border-brand-amber/40 rounded-card p-4 text-sm text-[#7a4f10]">
            <strong className="font-semibold">Dev mode.</strong> Testimonial editing is disabled —
            set <code className="font-mono">DATABASE_URL</code> and run{" "}
            <code className="font-mono">npm run prisma:push && npm run prisma:seed</code> to start
            publishing stories.
          </div>
        )}

        <TestimonialTable rows={rows} />

        <p className="text-xs text-brand-slate">
          Tip: featured stories appear on the homepage carousel (spec §5.9). Keep three to six
          featured at any time for visual balance.
        </p>
      </div>
    </>
  );
}
