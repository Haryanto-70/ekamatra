import { prisma } from "@/lib/prisma";
import MitraCard from "@/components/MitraCard";
import type { Prisma } from "@/generated/prisma/client";

export const revalidate = 0;

type SearchParams = {
  category?: string;
  city?: string;
  q?: string;
  sort?: string;
};

export default async function CariPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const where: Prisma.MitraProfileWhereInput = {};
  if (params.city) {
    where.city = { contains: params.city, mode: "insensitive" };
  }
  if (params.q) {
    where.OR = [
      { businessName: { contains: params.q, mode: "insensitive" } },
      { bio: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.category) {
    where.services = {
      some: { category: { slug: params.category } },
    };
  }

  const orderBy: Prisma.MitraProfileOrderByWithRelationInput =
    params.sort === "terbaru" ? { createdAt: "desc" } : { ratingAvg: "desc" };

  const mitras = await prisma.mitraProfile.findMany({
    where,
    orderBy,
    include: { services: { include: { category: true } } },
    take: 30,
  });

  const activeCategory = categories.find((c) => c.slug === params.category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-[#0f172a]">Cari Tukang</h1>
      <p className="mt-1 text-slate-500">
        {mitras.length} mitra ditemukan
        {activeCategory ? ` untuk kategori "${activeCategory.name}"` : ""}
      </p>

      <form className="mt-6 grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:grid-cols-4">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Cari nama tukang atau keahlian"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand sm:col-span-2"
        />
        <select
          name="category"
          defaultValue={params.category ?? ""}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          name="city"
          defaultValue={params.city ?? ""}
          placeholder="Kota"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark sm:col-span-4 sm:w-fit sm:justify-self-end"
        >
          Terapkan Filter
        </button>
      </form>

      {mitras.length === 0 ? (
        <p className="mt-10 text-center text-slate-500">
          Tidak ada mitra yang cocok. Coba ubah filter pencarian.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mitras.map((m) => (
            <MitraCard key={m.id} mitra={m} />
          ))}
        </div>
      )}
    </div>
  );
}
