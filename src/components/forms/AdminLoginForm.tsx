"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function AdminLoginForm({ hasGoogle }: { hasGoogle: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const reasonParam = params.get("error");

  const [error, setError] = useState<string | null>(
    reasonParam ? "Sign-in failed. Check your email and password." : null
  );
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      redirect: false
    });
    setBusy(false);
    if (!res?.ok) {
      setError("Invalid email or password.");
      return;
    }
    router.replace(next);
    router.refresh();
  }

  async function onGoogle() {
    setBusy(true);
    await signIn("google", { callbackUrl: next });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white text-brand-charcoal rounded-card p-6 space-y-4 shadow-card"
      aria-label="Admin sign in"
    >
      {error && (
        <p
          className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2"
          role="alert"
        >
          {error}
        </p>
      )}
      <Input label="Email" name="email" type="email" required autoComplete="email" />
      <Input
        label="Password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Signing in…" : "Sign in"}
      </Button>
      {hasGoogle && (
        <button
          type="button"
          onClick={onGoogle}
          disabled={busy}
          className="w-full h-12 rounded-lg border border-[#C8D8EA] text-brand-charcoal text-sm font-medium hover:bg-brand-ice disabled:opacity-60 inline-flex items-center justify-center gap-2"
        >
          <GoogleMark />
          Continue with Google
        </button>
      )}
      <p className="text-xs text-brand-slate text-center">
        Sessions expire after 30 minutes of inactivity. 5 failed attempts will lock the account.
      </p>
    </form>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8a12 12 0 1 1 0-24c3.059 0 5.842 1.155 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819A11.99 11.99 0 0 1 24 12c3.059 0 5.842 1.155 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238A11.93 11.93 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}
