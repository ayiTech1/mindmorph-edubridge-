import { Topbar } from "@/components/admin/Topbar";
import { getAuditEntries } from "@/lib/admin-data";

export const revalidate = 30;

const sections = [
  { h: "General", lines: ["Site name", "Tagline", "Logo & favicon", "Default contact details"] },
  { h: "Features", lines: ["WhatsApp button", "Live chat", "French toggle", "Maintenance mode"] },
  { h: "Notifications", lines: ["Lead WhatsApp acks", "Internal email digest", "Consultant SLA alerts"] },
  { h: "Integrations", lines: ["WhatsApp Business API (Twilio)", "HubSpot", "Cal.com / Calendly", "Google Analytics 4", "Mailchimp"] },
  { h: "SEO defaults", lines: ["Default meta description", "OG image", "Google verification"] },
  { h: "Domain & redirects", lines: ["Custom 301 redirects", "Slug change history"] }
];

const ACTION_LABELS: Record<string, string> = {
  LEAD_CREATED: "Lead captured",
  LEAD_STAGE_CHANGED: "Stage changed",
  LEAD_NOTES_UPDATED: "Notes updated",
  LEAD_REASSIGNED: "Lead reassigned"
};

function relativeTime(d: Date) {
  const diff = Date.now() - d.getTime();
  const m = 60 * 1000, h = 60 * m, day = 24 * h;
  if (diff < m) return "just now";
  if (diff < h) return `${Math.floor(diff / m)} min ago`;
  if (diff < day) return `${Math.floor(diff / h)}h ago`;
  return `${Math.floor(diff / day)}d ago`;
}

export default async function SettingsPage() {
  const audit = await getAuditEntries(25);

  return (
    <>
      <Topbar title="Settings" />
      <div className="p-6 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sections.map((s) => (
            <div key={s.h} className="bg-white border border-[#E6F1FB] rounded-card p-6 shadow-card">
              <h2 className="text-base font-semibold text-brand-navy">{s.h}</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-brand-charcoal/85">
                {s.lines.map((l) => (
                  <li key={l}>· {l}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="bg-white border border-[#E6F1FB] rounded-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#E6F1FB]">
            <div>
              <h2 className="text-base font-semibold text-brand-navy">Audit log</h2>
              <p className="text-xs text-brand-slate">
                Every administrative action — lead changes, content edits, settings — is recorded here
                (spec §5.12).
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-ice text-brand-navy">
                <tr>
                  <th className="text-left px-4 py-3">When</th>
                  <th className="text-left px-4 py-3">Who</th>
                  <th className="text-left px-4 py-3">Action</th>
                  <th className="text-left px-4 py-3">Resource</th>
                  <th className="text-left px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6F1FB]">
                {audit.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-brand-slate">
                      Nothing in the audit log yet.
                    </td>
                  </tr>
                ) : (
                  audit.map((e) => (
                    <tr key={e.id}>
                      <td className="px-4 py-3 text-brand-slate">{relativeTime(e.createdAt)}</td>
                      <td className="px-4 py-3 text-brand-charcoal">{e.userName}</td>
                      <td className="px-4 py-3 text-brand-charcoal font-medium">
                        {ACTION_LABELS[e.action] ?? e.action}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-brand-slate">{e.resource}</td>
                      <td className="px-4 py-3 font-mono text-xs text-brand-slate truncate max-w-[24rem]">
                        {e.details}
                      </td>
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
