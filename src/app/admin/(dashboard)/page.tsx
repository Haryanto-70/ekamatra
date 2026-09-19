import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [newLeads, pendingBookings, mitraCount, totalBookings] = await Promise.all([
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.mitraProfile.count(),
    prisma.booking.count(),
  ]);

  const cards = [
    { label: "Lead Baru", value: newLeads, hint: "Belum dihubungi" },
    { label: "Booking Pending", value: pendingBookings, hint: "Menunggu konfirmasi" },
    { label: "Total Mitra", value: mitraCount, hint: "Mitra terdaftar" },
    { label: "Total Booking", value: totalBookings, hint: "Sepanjang waktu" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0f172a]">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-1 text-3xl font-bold text-[#0f172a]">{c.value}</p>
            <p className="mt-1 text-xs text-slate-400">{c.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
