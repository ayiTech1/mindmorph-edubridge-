import { prisma, safeDbRead } from "./prisma";

/**
 * Lead auto-assignment (spec §5.4 — "Auto-assigned based on rules").
 *
 * Strategy:
 *   1. Find consultants whose specialisations include any token of the lead's
 *      service interest (e.g. "Admissions", "IELTS", "Visa").
 *   2. Among the matches, pick the one with the fewest currently-open leads
 *      (load balancing).
 *   3. If no specialisation match, fall back to the least-loaded ADMIN or
 *      CONSULTANT.
 *
 * Returns the chosen consultant's `id` or `null` when no consultants exist
 * yet (e.g. fresh database).
 */
export async function pickConsultantForLead(
  serviceInterest: string,
  destination?: string | null
): Promise<string | null> {
  const result = await safeDbRead(async () => {
    const consultants = await prisma.user.findMany({
      where: { active: true, role: { in: ["ADMIN", "CONSULTANT"] } },
      select: { id: true, specialisations: true, _count: { select: { assignedLeads: true } } }
    });
    if (consultants.length === 0) return null;

    const tokens = [serviceInterest, destination ?? ""]
      .join(" ")
      .toLowerCase()
      .split(/[\s,/·]+/)
      .filter(Boolean);

    const scored = consultants.map((c) => {
      const spec = (c.specialisations ?? "").toLowerCase();
      const matches = tokens.filter((t) => spec.includes(t)).length;
      // Lower load wins ties; higher specialisation match wins overall.
      return { id: c.id, matches, load: c._count.assignedLeads };
    });

    scored.sort((a, b) => {
      if (b.matches !== a.matches) return b.matches - a.matches;
      return a.load - b.load;
    });

    return scored[0].id;
  }, "lead-routing/pick");

  return result ?? null;
}
