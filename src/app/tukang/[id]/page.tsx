import { prisma } from "@/lib/prisma";
import StarRating from "@/components/StarRating";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildWaLink } from "@/lib/whatsapp";

export const revalidate = 0;

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function TukangProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const mitra = await prisma.mitraProfile.findUnique({
    where: { id },
    include: {
      services: { where: { isActive: true }, include: { category: true } },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { customer: true },
      },
    },
  });

  if (!mitra) notFound();

  const waLink = buildWaLink(
    mitra.whatsappNumber,
    `Halo ${mitra.businessName}, saya ingin bertanya tentang jasa Anda.`
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0f172a]">{mitra.businessName}</h1>
              {mitra.isVerified && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                  Terverifikasi
                </span>
              )}
            </div>
            <p className="mt-1 text-slate-500">{mitra.city}</p>
            <div className="mt-2">
              <StarRating rating={mitra.ratingAvg} reviewCount={mitra.reviewCount} />
            </div>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Chat WhatsApp
          </a>
        </div>
        <p className="mt-4 text-slate-600">{mitra.bio}</p>
        <p className="mt-2 text-sm text-slate-500">
          {mitra.yearsExperience} tahun pengalaman
        </p>
      </div>

      <h2 className="mt-10 text-xl font-bold text-[#0f172a]">Layanan</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {mitra.services.map((s) => (
          <div
            key={s.id}
            className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <span className="text-xs font-semibold text-brand">{s.category.name}</span>
            <p className="mt-1 font-bold text-[#0f172a]">{s.title}</p>
            {s.description && (
              <p className="mt-1 text-sm text-slate-500">{s.description}</p>
            )}
            <p className="mt-3 font-semibold text-slate-700">
              {formatRupiah(s.priceMin)} - {formatRupiah(s.priceMax)}
            </p>
            <Link
              href={`/booking/${s.id}`}
              className="mt-4 rounded-lg bg-brand py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Booking Sekarang
            </Link>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold text-[#0f172a]">Ulasan Terbaru</h2>
      {mitra.reviews.length === 0 ? (
        <p className="mt-4 text-slate-500">Belum ada ulasan.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {mitra.reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-100 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[#0f172a]">{r.customer.name}</p>
                <StarRating rating={r.rating} />
              </div>
              {r.comment && <p className="mt-2 text-sm text-slate-600">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
