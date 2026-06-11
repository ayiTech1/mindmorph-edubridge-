import { Topbar } from "@/components/admin/Topbar";
import { KpiCard } from "@/components/admin/KpiCard";
import {
  BarChart,
  Donut,
  FunnelChart,
  HBarChart,
  LineChart,
  MiniGeoMap
} from "@/components/admin/Charts";
import {
  getDashboardKpis,
  getRecentLeads,
  getLeadsByDestination,
  getLeadOrigins
} from "@/lib/admin-data";

// Refresh server data every 60s — keeps the dashboard fresh without the cost
// of a fully dynamic page.
export const revalidate = 60;

export default async function AdminDashboard() {
  const [kpis, recentLeads, byDestination, origins] = await Promise.all([
    getDashboardKpis(),
    getRecentLeads(5),
    getLeadsByDestination(),
    getLeadOrigins()
  ]);

  const kpiCards = [
    {
      label: "Total leads this month",
      value: kpis.leadsThisMonth,
      delta: { value: "vs last month", positive: true }
    },
    {
      label: "Consultations booked",
      value: kpis.consultationsThisMonth,
      delta: { value: "vs last month", positive: true }
    },
    {
      label: "Placements confirmed",
      value: kpis.placementsConfirmed,
      hint: `YTD: ${kpis.placementsYTD}`
    },
    {
      label: "Revenue (GHS)",
      value: "₵ 286,400",
      delta: { value: "+12%", positive: true }
    },
    {
      label: "Website visitors (30d)",
      value: kpis.visitors30d.toLocaleString("en-GB"),
      delta: { value: "+34%", positive: true }
    },
    {
      label: "Open leads",
      value: kpis.openLeads,
      hint: kpis.openLeadsOverSla > 0 ? `${kpis.openLeadsOverSla} over SLA` : undefined
    }
  ];

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="p-6 space-y-8">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-slate mb-3">
            Today at a glance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {kpiCards.map((k) => (
              <KpiCard key={k.label} {...k} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Panel className="lg:col-span-2" title="Lead volume — last 6 months" hint="Stacked by source">
            <BarChart labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]} values={[62, 78, 95, 88, 124, kpis.leadsThisMonth]} />
          </Panel>
          <Panel title="Leads by destination">
            <Donut segments={byDestination} />
          </Panel>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Panel title="Conversion funnel" className="lg:col-span-2">
            <FunnelChart
              stages={[
                { label: "Visitors (30d)", value: kpis.visitors30d },
                { label: "Form starts", value: 462 },
                { label: "Form completes", value: kpis.leadsThisMonth },
                { label: "Consultations booked", value: kpis.consultationsThisMonth },
                { label: "Placements", value: kpis.placementsConfirmed }
              ]}
            />
          </Panel>
          <Panel title="Service breakdown">
            <HBarChart
              rows={[
                { label: "Admissions", value: 64 },
                { label: "Test Prep", value: 41 },
                { label: "Counselling", value: 18 },
                { label: "Corporate", value: 10 },
                { label: "Visa", value: 9 }
              ]}
            />
          </Panel>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Panel title="Website traffic & conversion (30d)" className="lg:col-span-2">
            <LineChart
              labels={["W1", "W2", "W3", "W4"]}
              series={[
                { name: "Visitors", values: [2840, 3160, 3320, 3527] },
                { name: "Bookings", values: [12, 18, 22, 32], color: "#1D9E75" }
              ]}
            />
            <div className="mt-3 flex gap-5 text-xs">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-sky" />
                Visitors
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-teal" />
                Bookings
              </span>
            </div>
          </Panel>
          <Panel title="Lead origin — West Africa">
            <MiniGeoMap origins={origins} />
          </Panel>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Panel title="Revenue by service (₵, 6 months)">
            <BarChart labels={["Adm.", "Test", "Couns.", "Visa", "Corp."]} values={[182, 96, 24, 41, 138]} />
          </Panel>
          <Panel title="Consultant performance" hint="Leads handled this month">
            <HBarChart
              rows={[
                { label: "Kwabena O.", value: 42, max: 50 },
                { label: "Fatou S.", value: 36, max: 50 },
                { label: "Sandra N.", value: 28, max: 50 },
                { label: "Emmanuel A.", value: 22, max: 50 }
              ]}
            />
          </Panel>
        </section>

        <section className="bg-white border border-[#E6F1FB] rounded-card p-6 shadow-card">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-navy">Recent leads</h2>
            <a href="/admin/leads" className="text-sm font-medium text-brand-ocean hover:underline">
              View all →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-ice text-brand-navy">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">WhatsApp</th>
                  <th className="text-left px-4 py-3">Service</th>
                  <th className="text-left px-4 py-3">Stage</th>
                  <th className="text-left px-4 py-3">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6F1FB]">
                {recentLeads.map((l) => (
                  <tr key={l.id}>
                    <td className="px-4 py-3 font-medium text-brand-charcoal">{l.fullName}</td>
                    <td className="px-4 py-3 text-brand-slate">{l.whatsapp}</td>
                    <td className="px-4 py-3 text-brand-charcoal">{l.service}</td>
                    <td className="px-4 py-3">
                      <StageBadge label={l.stage} />
                    </td>
                    <td className="px-4 py-3 text-brand-slate">{l.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

function Panel({
  title,
  hint,
  className,
  children
}: {
  title: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-white border border-[#E6F1FB] rounded-card p-6 shadow-card ${className ?? ""}`}>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-semibold text-brand-navy">{title}</h2>
        {hint && <span className="text-xs text-brand-slate">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function StageBadge({ label }: { label: string }) {
  const tone: Record<string, string> = {
    NEW: "bg-brand-sky/15 text-brand-ocean",
    CONTACTED: "bg-brand-amber/15 text-[#8a5710]",
    CONSULTATION_BOOKED: "bg-brand-teal/15 text-[#0e7a59]",
    ACTIVE: "bg-brand-navy/10 text-brand-navy",
    VISA_STAGE: "bg-brand-sky/20 text-brand-navy",
    PLACED: "bg-brand-teal/25 text-[#0a5b41]",
    LOST: "bg-brand-slate/15 text-brand-charcoal"
  };
  const human = label.replace(/_/g, " ").toLowerCase().replace(/^./, (c) => c.toUpperCase());
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-pill text-xs font-medium ${tone[label] ?? "bg-brand-slate/15 text-brand-charcoal"}`}>
      {human}
    </span>
  );
}
