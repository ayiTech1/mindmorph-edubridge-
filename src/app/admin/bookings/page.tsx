import { Topbar } from "@/components/admin/Topbar";

const bookings = [
  { id: "B-2421", student: "Adwoa Mensah", service: "Admissions · UK", consultant: "Kwabena O.", when: "Today, 14:00", format: "Video" },
  { id: "B-2422", student: "Olumide Bello", service: "IELTS diagnostic", consultant: "Emmanuel A.", when: "Today, 15:30", format: "In-person" },
  { id: "B-2423", student: "Marie Koffi", service: "Admissions · Germany", consultant: "Fatou S.", when: "Tomorrow, 10:00", format: "Video" },
  { id: "B-2424", student: "Kojo Owusu", service: "Visa · Canada", consultant: "Sandra N.", when: "Wed, 11:30", format: "Phone" }
];

export default function BookingsPage() {
  return (
    <>
      <Topbar title="Bookings" />
      <div className="p-6">
        <div className="bg-white border border-[#E6F1FB] rounded-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#E6F1FB]">
            <h2 className="text-base font-semibold text-brand-navy">Upcoming consultations</h2>
            <div className="flex gap-2">
              <select className="h-10 px-3 rounded-lg border border-[#C8D8EA] text-sm">
                <option>All consultants</option>
                <option>Kwabena O.</option>
                <option>Fatou S.</option>
                <option>Emmanuel A.</option>
                <option>Sandra N.</option>
              </select>
              <button className="h-10 px-4 rounded-lg bg-brand-navy text-white text-sm">+ Manual booking</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-ice text-brand-navy">
                <tr>
                  <th className="text-left px-4 py-3">Booking ID</th>
                  <th className="text-left px-4 py-3">Student</th>
                  <th className="text-left px-4 py-3">Service</th>
                  <th className="text-left px-4 py-3">Consultant</th>
                  <th className="text-left px-4 py-3">When</th>
                  <th className="text-left px-4 py-3">Format</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6F1FB]">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-brand-cream/60">
                    <td className="px-4 py-3 font-mono text-xs text-brand-slate">{b.id}</td>
                    <td className="px-4 py-3 font-medium text-brand-charcoal">{b.student}</td>
                    <td className="px-4 py-3">{b.service}</td>
                    <td className="px-4 py-3">{b.consultant}</td>
                    <td className="px-4 py-3 text-brand-navy font-medium">{b.when}</td>
                    <td className="px-4 py-3 text-brand-slate">{b.format}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
