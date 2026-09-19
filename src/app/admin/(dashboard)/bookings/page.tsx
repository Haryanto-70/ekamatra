import { prisma } from "@/lib/prisma";
import { updateBookingStatusAction } from "@/app/actions";
import StatusSelect from "@/components/StatusSelect";

export const revalidate = 0;

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, mitra: true, service: true },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0f172a]">Booking</h1>
      <p className="mt-1 text-slate-500">Semua booking yang masuk dari customer</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Mitra</th>
              <th className="px-4 py-3">Layanan</th>
              <th className="px-4 py-3">Estimasi</th>
              <th className="px-4 py-3">Jadwal</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#0f172a]">{b.customer.name}</p>
                  <p className="text-xs text-slate-400">{b.customer.phone}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{b.mitra.businessName}</td>
                <td className="px-4 py-3 text-slate-600">{b.service.title}</td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                  {formatRupiah(b.estimatedPriceMin)} - {formatRupiah(b.estimatedPriceMax)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                  {b.scheduledAt.toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3">
                  <StatusSelect
                    id={b.id}
                    status={b.status}
                    kind="booking"
                    onUpdate={updateBookingStatusAction}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <p className="p-6 text-center text-slate-400">Belum ada booking.</p>
        )}
      </div>
    </div>
  );
}
