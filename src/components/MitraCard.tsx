import Link from "next/link";
import StarRating from "./StarRating";

export type MitraCardData = {
  id: string;
  businessName: string;
  city: string;
  bio: string | null;
  ratingAvg: number;
  reviewCount: number;
  isVerified: boolean;
  yearsExperience: number;
  services: { title: string; priceMin: number; category: { name: string } }[];
};

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function MitraCard({ mitra }: { mitra: MitraCardData }) {
  const minPrice = mitra.services.length
    ? Math.min(...mitra.services.map((s) => s.priceMin))
    : null;
  const categories = Array.from(
    new Set(mitra.services.map((s) => s.category.name))
  ).slice(0, 3);

  return (
    <Link
      href={`/tukang/${mitra.id}`}
      className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-[#0f172a]">{mitra.businessName}</p>
          <p className="text-sm text-slate-500">{mitra.city}</p>
        </div>
        {mitra.isVerified && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
            Terverifikasi
          </span>
        )}
      </div>

      <div className="mt-3">
        <StarRating rating={mitra.ratingAvg} reviewCount={mitra.reviewCount} />
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-slate-500">{mitra.bio}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <span
            key={c}
            className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-brand-dark"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
        <span className="text-slate-500">{mitra.yearsExperience} th pengalaman</span>
        {minPrice !== null && (
          <span className="font-semibold text-brand">
            Mulai {formatRupiah(minPrice)}
          </span>
        )}
      </div>
    </Link>
  );
}
