import { prisma } from "@/lib/prisma";
import QuickContactForm from "@/components/QuickContactForm";

export const revalidate = 0;

export default async function JadiMitraPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">
            Jadi Mitra Tukang, Dapatkan Lebih Banyak Pelanggan
          </h1>
          <p className="mt-3 text-slate-600">
            Daftarkan keahlian Anda dan mulai terima order dari customer di
            sekitar area kerja Anda. Gratis, tanpa biaya pendaftaran.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="text-brand">&#10003;</span> Profil & portofolio ditampilkan ke ribuan calon customer
            </li>
            <li className="flex gap-2">
              <span className="text-brand">&#10003;</span> Order masuk langsung ke WhatsApp Anda
            </li>
            <li className="flex gap-2">
              <span className="text-brand">&#10003;</span> Bangun reputasi lewat rating & ulasan
            </li>
          </ul>
        </div>
        <QuickContactForm
          categories={categories}
          heading="Daftar Jadi Mitra"
          subheading="Tim kami akan menghubungi Anda via WhatsApp untuk proses onboarding."
          categoryLabel="Keahlian utama (opsional)"
          messagePlaceholder="Ceritakan pengalaman & keahlian Anda (opsional)"
        />
      </div>
    </div>
  );
}
