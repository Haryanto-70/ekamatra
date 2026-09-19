import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="mb-2 text-base font-bold text-[#0f172a]">
              Ekamatra<span className="text-brand">Tukang</span>
            </p>
            <p>
              Platform pencarian tukang terpercaya. Booking cepat, harga
              transparan, respon via WhatsApp.
            </p>
          </div>
          <div>
            <p className="mb-2 font-semibold text-[#0f172a]">Untuk Customer</p>
            <ul className="space-y-1">
              <li>
                <Link href="/cari" className="hover:text-brand">
                  Cari Tukang
                </Link>
              </li>
              <li>
                <Link href="/#cara-kerja" className="hover:text-brand">
                  Cara Kerja
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-semibold text-[#0f172a]">Untuk Mitra</p>
            <ul className="space-y-1">
              <li>
                <Link href="/jadi-mitra" className="hover:text-brand">
                  Daftar Jadi Mitra
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-black/5 pt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} EkamatraTukang. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
}
