import { prisma, safeDbWrite } from "./prisma";

interface AuditEntry {
  userId?: string | null;
  action: string;
  resource: string;
  details?: string;
}

/**
 * Append an entry to the audit log (spec §5.1 / §5.12).
 * Fails silently — audit must never break the operation it's tracking.
 */
export async function recordAudit(entry: AuditEntry): Promise<void> {
  await safeDbWrite(
    () =>
      prisma.auditLog.create({
        data: {
          userId: entry.userId ?? null,
          action: entry.action,
          resource: entry.resource,
          details: entry.details ?? null
        }
      }),
    "audit/record"
  );
}
