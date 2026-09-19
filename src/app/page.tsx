import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MitraCard from "@/components/MitraCard";
import QuickContactForm from "@/components/QuickContactForm";

export const revalidate = 0;

export default async function HomePage() {
  const [categories, mitras] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.mitraProfile.findMany({
      orderBy: { ratingAvg: "desc" },
      take: 6,
      include: { services: { include: { category: true }, take: 3 } },
    }),
  ]);

  return (
    <div>
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight text-[#0f172a] md:text-5xl">
              Cari Tukang Terpercaya,{" "}
              <span className="text-brand">Respon Cepat via WhatsApp</span>
            </h1>
            <p className="mt-4 text-slate-600">
              Listrik, ledeng, cat, AC, renovasi, sampai kebersihan rumah —
              temukan mitra tukang terverifikasi dengan harga transparan dan
              booking online.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/cari"
                className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Cari Tukang Sekarang
              </Link>
              <Link
                href="/jadi-mitra"
                className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
              >
                Daftar Jadi Mitra
              </Link>
            </div>
            <div className="mt-8 flex gap-8 text-sm text-slate-500">
              <div>
                <p className="text-2xl font-bold text-[#0f172a]">500+</p>
                <p>Mitra Aktif</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0f172a]">10rb+</p>
                <p>Pekerjaan Selesai</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0f172a]">4.8/5</p>
                <p>Rating Rata-rata</p>
              </div>
            </div>
          </div>
          <QuickContactForm categories={categories} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-[#0f172a]">Kategori Populer</h2>
        <p className="mt-1 text-slate-500">Pilih jenis jasa yang Anda butuhkan</p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/cari?category=${c.slug}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-lg font-bold text-brand">
                {c.name.charAt(0)}
              </span>
              <span className="text-sm font-semibold text-slate-700">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#0f172a]">Mitra Terbaik</h2>
              <p className="mt-1 text-slate-500">
                Tukang dengan rating tertinggi minggu ini
              </p>
            </div>
            <Link href="/cari" className="text-sm font-semibold text-brand hover:underline">
              Lihat semua &rarr;
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mitras.map((m) => (
              <MitraCard key={m.id} mitra={m} />
            ))}
          </div>
        </div>
      </section>

      <section id="cara-kerja" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-[#0f172a]">Cara Kerja</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Cari & Pilih Tukang",
              desc: "Gunakan pencarian & filter untuk temukan mitra sesuai kebutuhan dan lokasi Anda.",
            },
            {
              step: "2",
              title: "Booking & Estimasi Harga",
              desc: "Isi form booking, dapatkan estimasi harga, lalu konfirmasi jadwal pengerjaan.",
            },
            {
              step: "3",
              title: "Terhubung via WhatsApp",
              desc: "Mitra langsung menghubungi Anda via WhatsApp untuk koordinasi lebih lanjut.",
            },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-slate-100 p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                {s.step}
              </span>
              <p className="mt-3 font-bold text-[#0f172a]">{s.title}</p>
              <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
