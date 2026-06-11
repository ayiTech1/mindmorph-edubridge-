import { Sidebar } from "@/components/admin/Sidebar";

export const metadata = {
  title: "Admin · Mindmorph Edubridge",
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-cream">
      <Sidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
