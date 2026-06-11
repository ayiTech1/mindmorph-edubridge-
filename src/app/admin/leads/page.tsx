import Link from "next/link";
import { Topbar } from "@/components/admin/Topbar";
import { getRecentLeads, getStageCounts } from "@/lib/admin-data";

export const revalidate = 30;

const STAGE_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  CONSULTATION_BOOKED: "Consultation booked",
  ACTIVE: "Active",
  VISA_STAGE: "Visa stage",
  PLACED: "Placed",
  LOST: "Lost"
};

export default async function LeadsPage() {
  const [stages, leads] = await Promise.all([getStageCounts(), getRecentLeads(25)]);

  const stageList = Object.entries(STAGE_LABELS).map(([key, label]) => ({
    key,
    label,
    count: stages[key as keyof typeof stages] ?? 0
  }));

  return (
    <>
      <Topbar title="Leads & CRM" />
      <div className="p-6 space-y-6">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-slate mb-3">
            Pipeline
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {stageList.map((s) => (
              <div key={s.key} className="bg-white border border-[#E6F1FB] rounded-card p-4">
                <p className="text-xs uppercase tracking-wider text-brand-slate">{s.label}</p>
                <p className="mt-2 text-2xl font-bold text-brand-navy">{s.count}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-[#E6F1FB] rounded-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#E6F1FB]">
            <h2 className="text-base font-semibold text-brand-navy">All leads</h2>
            <div className="flex gap-2">
              <input
                type="search"
                placeholder="Search name / phone…"
                className="h-10 px-3 rounded-lg border border-[#C8D8EA] text-sm w-64"
              />
              <button className="h-10 px-4 rounded-lg bg-brand-navy text-white text-sm">+ Add lead</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-ice text-brand-navy">
                <tr>
                  <th className="text-left px-4 py-3">Lead ID</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Service</th>
                  <th className="text-left px-4 py-3">Stage</th>
                  <th className="text-left px-4 py-3">Consultant</th>
                  <th className="text-left px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6F1FB]">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-brand-slate">
                      No leads yet. Submit a consultation request from the public site to see it
                      appear here.
                    </td>
                  </tr>
                ) : (
                  leads.map((l) => (
                    <tr key={l.id} className="hover:bg-brand-cream/60 cursor-pointer">
                      <td className="px-4 py-3 font-mono text-xs text-brand-slate">
                        <Link href={`/admin/leads/${l.id}`} className="hover:underline">
                          {l.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-medium text-brand-charcoal">
                        <Link href={`/admin/leads/${l.id}`} className="hover:text-brand-navy hover:underline">
                          {l.fullName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-brand-charcoal">{l.service}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-1 rounded-pill text-xs font-medium bg-brand-sky/15 text-brand-ocean">
                          {STAGE_LABELS[l.stage] ?? l.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-brand-charcoal">{l.consultant}</td>
                      <td className="px-4 py-3 text-brand-slate">{l.updated}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
