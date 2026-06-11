import Link from "next/link";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/admin/Topbar";
import { LeadStageControl } from "@/components/admin/LeadStageControl";
import { LeadNotes } from "@/components/admin/LeadNotes";
import { LeadAssign } from "@/components/admin/LeadAssign";
import { prisma, isDbConfigured, safeDbRead } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface PageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: PageProps) {
  if (!isDbConfigured()) {
    return (
      <>
        <Topbar title="Lead" />
        <DevModeNotice id={params.id} />
      </>
    );
  }

  const lead = await safeDbRead(
    () =>
      prisma.lead.findUnique({
        where: { id: params.id },
        include: {
          consultant: { select: { id: true, name: true } },
          bookings: {
            orderBy: { scheduledFor: "desc" },
            select: { id: true, scheduledFor: true, format: true, status: true, serviceType: true }
          },
          documents: { select: { id: true, label: true, url: true, createdAt: true } }
        }
      }),
    "lead-detail/find"
  );

  if (!lead) return notFound();

  const consultantOptions = await safeDbRead(
    () =>
      prisma.user.findMany({
        where: { active: true, role: { in: ["ADMIN", "CONSULTANT"] } },
        select: { id: true, name: true },
        orderBy: { name: "asc" }
      }),
    "lead-detail/consultants"
  );

  return (
    <>
      <Topbar title={`Lead · ${lead.fullName}`} />
      <div className="p-6 space-y-6">
        <nav className="text-sm text-brand-slate">
          <Link href="/admin/leads" className="hover:text-brand-navy">← All leads</Link>
        </nav>

        <header className="bg-white border border-[#E6F1FB] rounded-card p-6 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">{lead.fullName}</h2>
              <p className="mt-1 text-sm text-brand-slate">
                Created {formatDate(lead.createdAt)} · Source {lead.source.replace(/_/g, " ").toLowerCase()}
              </p>
              <p className="mt-1 text-xs font-mono text-brand-slate">{lead.id}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={buildWhatsAppLink(`Hi ${lead.fullName.split(" ")[0]}, this is Mindmorph following up on your enquiry.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-4 rounded-lg bg-[#25D366] text-white text-sm font-medium inline-flex items-center gap-2"
              >
                WhatsApp now
              </a>
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="h-10 px-4 rounded-lg border border-brand-navy text-brand-navy text-sm font-medium inline-flex items-center"
                >
                  Email
                </a>
              )}
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
            <Field label="WhatsApp" value={lead.whatsappNumber} />
            <Field label="Email" value={lead.email ?? "—"} />
            <Field label="Country" value={lead.country} />
            <Field label="Education level" value={lead.educationLevel} />
            <Field label="Service" value={lead.serviceInterest} />
            <Field label="Destination" value={lead.targetDestinations ?? "—"} />
            <Field label="Timeline" value={lead.timeline ?? "—"} />
            <Field label="Last activity" value={formatDate(lead.lastActivityAt)} />
          </dl>
        </header>

        <section className="bg-white border border-[#E6F1FB] rounded-card p-6 shadow-card">
          <LeadStageControl leadId={lead.id} currentStage={lead.stage} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[#E6F1FB] rounded-card p-6 shadow-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-slate mb-3">
              Internal notes
            </h3>
            <LeadNotes leadId={lead.id} initial={lead.notes ?? ""} />
          </div>

          <div className="bg-white border border-[#E6F1FB] rounded-card p-6 shadow-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-slate mb-3">
              Assigned consultant
            </h3>
            <LeadAssign
              leadId={lead.id}
              current={lead.consultant?.id ?? null}
              options={consultantOptions ?? []}
            />
            {lead.consultant && (
              <p className="mt-3 text-xs text-brand-slate">
                Current: <span className="font-medium text-brand-charcoal">{lead.consultant.name}</span>
              </p>
            )}
          </div>
        </section>

        <section className="bg-white border border-[#E6F1FB] rounded-card p-6 shadow-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-slate mb-3">
            Booking history
          </h3>
          {lead.bookings.length === 0 ? (
            <p className="text-sm text-brand-slate">No bookings yet for this lead.</p>
          ) : (
            <ul className="divide-y divide-[#E6F1FB]">
              {lead.bookings.map((b) => (
                <li key={b.id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-brand-charcoal">{b.serviceType}</p>
                    <p className="text-xs text-brand-slate">
                      {formatDate(b.scheduledFor)} · {b.format.replace(/_/g, " ").toLowerCase()}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-wider text-brand-slate">{b.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white border border-[#E6F1FB] rounded-card p-6 shadow-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-slate mb-3">
            Documents
          </h3>
          {lead.documents.length === 0 ? (
            <p className="text-sm text-brand-slate">
              No documents uploaded. (Drag-and-drop uploader ships in Phase 2.)
            </p>
          ) : (
            <ul className="divide-y divide-[#E6F1FB]">
              {lead.documents.map((d) => (
                <li key={d.id} className="py-3 flex items-center justify-between text-sm">
                  <a href={d.url} className="text-brand-ocean hover:underline" target="_blank" rel="noopener noreferrer">
                    {d.label}
                  </a>
                  <span className="text-xs text-brand-slate">{formatDate(d.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-brand-slate">{label}</dt>
      <dd className="mt-1 font-medium text-brand-charcoal break-words">{value}</dd>
    </div>
  );
}

function DevModeNotice({ id }: { id: string }) {
  return (
    <div className="p-6">
      <Link href="/admin/leads" className="text-sm text-brand-ocean hover:underline">
        ← All leads
      </Link>
      <div className="mt-4 bg-white border border-[#E6F1FB] rounded-card p-6 shadow-card">
        <h2 className="text-xl font-semibold text-brand-navy">Lead detail unavailable in dev mode</h2>
        <p className="mt-2 text-sm text-brand-charcoal/80">
          Configure <code className="font-mono bg-brand-ice rounded px-1.5 py-0.5">DATABASE_URL</code>,
          run <code className="font-mono bg-brand-ice rounded px-1.5 py-0.5">npm run prisma:push</code>
          + <code className="font-mono bg-brand-ice rounded px-1.5 py-0.5">npm run prisma:seed</code>, then revisit
          lead <code className="font-mono">{id.slice(0, 8)}…</code>
        </p>
      </div>
    </div>
  );
}
