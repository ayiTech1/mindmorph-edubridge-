import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma client.
 *
 * The client is constructed lazily and **does not connect** until the first
 * query, so importing this module is safe even when DATABASE_URL is unset
 * (development without a local MySQL, builds in CI without secrets, etc.).
 *
 * Callers should treat database access as best-effort and wrap writes in
 * try/catch — see `safeDbWrite` below. Reads should use `safeDbRead` which
 * returns `null` on failure so the caller can fall back to mock data.
 */

declare global {
  // eslint-disable-next-line no-var
  var __mindmorphPrisma: PrismaClient | undefined;
}

function createPrisma() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "production"
        ? ["error", "warn"]
        : ["error", "warn"]
  });
}

export const prisma: PrismaClient =
  globalThis.__mindmorphPrisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalThis.__mindmorphPrisma = prisma;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("stub"));
}

/**
 * Run a Prisma write and swallow any connection / schema errors.
 * Use only for fire-and-forget side effects (e.g. an audit log entry).
 */
export async function safeDbWrite<T>(
  op: () => Promise<T>,
  context = "db-write"
): Promise<T | null> {
  try {
    return await op();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[${context}] database write skipped: ${msg}`);
    return null;
  }
}

/**
 * Run a Prisma read with the same graceful-degradation semantics.
 * Callers should treat a `null` return as "no data — use fallback".
 */
export async function safeDbRead<T>(
  op: () => Promise<T>,
  context = "db-read"
): Promise<T | null> {
  if (!isDbConfigured()) return null;
  try {
    return await op();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[${context}] database read failed: ${msg}`);
    return null;
  }
}
