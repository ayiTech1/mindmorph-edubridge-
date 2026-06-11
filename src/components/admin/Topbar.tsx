import { UserMenu } from "./UserMenu";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-[#E6F1FB] h-16 flex items-center justify-between px-6">
      <h1 className="text-base font-semibold text-brand-navy">{title}</h1>
      <UserMenu />
    </header>
  );
}
