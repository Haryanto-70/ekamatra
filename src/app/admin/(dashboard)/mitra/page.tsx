import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function AdminMitraPage() {
  const mitras = await prisma.mitraProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: { services: true, _count: { select: { bookings: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0f172a]">Mitra</h1>
      <p className="mt-1 text-slate-500">Semua mitra tukang terdaftar</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Nama Usaha</th>
              <th className="px-4 py-3">Kota</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Layanan</th>
              <th className="px-4 py-3">Booking</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {mitras.map((m) => (
              <tr key={m.id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3 font-medium text-[#0f172a]">{m.businessName}</td>
                <td className="px-4 py-3 text-slate-500">{m.city}</td>
                <td className="px-4 py-3 text-slate-500">{m.whatsappNumber}</td>
                <td className="px-4 py-3 text-slate-500">
                  {m.ratingAvg.toFixed(1)} ({m.reviewCount})
                </td>
                <td className="px-4 py-3 text-slate-500">{m.services.length}</td>
                <td className="px-4 py-3 text-slate-500">{m._count.bookings}</td>
                <td className="px-4 py-3">
                  {m.isVerified ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                      Terverifikasi
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                      Belum Verifikasi
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {mitras.length === 0 && (
          <p className="p-6 text-center text-slate-400">Belum ada mitra.</p>
        )}
      </div>
    </div>
  );
}
