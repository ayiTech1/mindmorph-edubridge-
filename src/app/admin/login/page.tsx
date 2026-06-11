import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { AdminLoginForm } from "@/components/forms/AdminLoginForm";
import { isDbConfigured } from "@/lib/prisma";

export const metadata = {
  title: "Admin login · Mindmorph Edubridge",
  robots: { index: false, follow: false }
};

export default function AdminLoginPage() {
  const hasGoogle = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  const dbReady = isDbConfigured();

  return (
    <div className="min-h-screen bg-brand-navy text-white grid place-items-center px-4 py-12">
      <Container className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Mindmorph Admin</h1>
          <p className="text-brand-ice/70 text-sm">Sign in to the operations console.</p>
        </div>

        <Suspense fallback={<div className="bg-white rounded-card h-72" />}>
          <AdminLoginForm hasGoogle={hasGoogle} />
        </Suspense>

        {!dbReady && (
          <div className="mt-6 bg-white/10 border border-brand-sky/40 rounded-lg p-4 text-xs text-brand-ice/85">
            <p className="font-semibold text-brand-ice">Dev mode — database not configured.</p>
            <p className="mt-1">
              You can sign in with:
              <br />
              <code className="font-mono">admin@mindmorphedubridge.com</code> /{" "}
              <code className="font-mono">mindmorph2026</code>
            </p>
            <p className="mt-1 text-brand-ice/70">
              Set <code className="font-mono">DATABASE_URL</code> and run{" "}
              <code className="font-mono">npm run prisma:push && npm run prisma:seed</code> to
              use real accounts.
            </p>
          </div>
        )}

        <p className="text-center mt-6 text-xs text-brand-ice/70">
          <Link href="/" className="hover:underline">
            ← Back to website
          </Link>
        </p>
      </Container>
    </div>
  );
}
