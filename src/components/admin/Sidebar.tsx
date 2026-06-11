"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sections = [
  {
    heading: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: "▦" }]
  },
  {
    heading: "Pipeline",
    items: [
      { href: "/admin/leads", label: "Leads & CRM", icon: "◉" },
      { href: "/admin/bookings", label: "Bookings", icon: "◍" }
    ]
  },
  {
    heading: "Content",
    items: [
      { href: "/admin/content", label: "Pages & articles", icon: "✎" },
      { href: "/admin/scholarships", label: "Scholarships", icon: "★" },
      { href: "/admin/testimonials", label: "Success stories", icon: "❝" }
    ]
  },
  {
    heading: "Team",
    items: [
      { href: "/admin/team", label: "Team members", icon: "▤" },
      { href: "/admin/settings", label: "Settings", icon: "◴" }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:block w-64 shrink-0 bg-brand-navy text-white min-h-screen p-5 sticky top-0">
      <Link href="/admin" className="block mb-8">
        <span className="block text-sm font-semibold text-brand-ice">Mindmorph Admin</span>
        <span className="block text-xs text-brand-sky">Operations Console</span>
      </Link>
      <nav>
        {sections.map((sec) => (
          <div key={sec.heading} className="mb-6">
            <p className="text-[10px] uppercase tracking-widest text-brand-sky mb-2">{sec.heading}</p>
            <ul className="space-y-0.5">
              {sec.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition",
                        active
                          ? "bg-white/10 text-white"
                          : "text-brand-ice/85 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span aria-hidden="true">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
