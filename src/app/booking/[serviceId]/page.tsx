import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingForm from "@/components/BookingForm";

export const revalidate = 0;

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { mitra: true, category: true },
  });

  if (!service) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-[#0f172a]">Booking Layanan</h1>

      <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <span className="text-xs font-semibold text-brand">{service.category.name}</span>
        <p className="mt-1 text-lg font-bold text-[#0f172a]">{service.title}</p>
        <p className="text-sm text-slate-500">
          oleh {service.mitra.businessName} &middot; {service.mitra.city}
        </p>
        <p className="mt-3 rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-brand-dark">
          Estimasi harga: {formatRupiah(service.priceMin)} - {formatRupiah(service.priceMax)}
          <span className="ml-1 font-normal text-slate-500">
            (harga final ditentukan setelah survei/pengecekan lokasi)
          </span>
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <BookingForm serviceId={service.id} />
      </div>
    </div>
  );
}
