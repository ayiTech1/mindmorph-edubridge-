"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-3 rounded-lg p-1 pl-3 hover:bg-brand-ice transition-colors"
      >
        <span className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-sm font-medium text-brand-charcoal">
            {user?.name ?? "Signed in"}
          </span>
          {user?.role && (
            <span className="text-[10px] uppercase tracking-widest text-brand-slate">
              {user.role.replace(/_/g, " ")}
            </span>
          )}
        </span>
        <span
          className="w-9 h-9 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center"
          aria-hidden="true"
        >
          {initials}
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E6F1FB] rounded-card shadow-card z-20 p-1"
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-brand-charcoal truncate">
                {user?.name ?? "Account"}
              </p>
              <p className="text-xs text-brand-slate truncate">{user?.email ?? ""}</p>
            </div>
            <hr className="my-1 border-[#E6F1FB]" />
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="w-full text-left px-3 py-2 text-sm text-brand-charcoal rounded-md hover:bg-brand-ice"
              role="menuitem"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
