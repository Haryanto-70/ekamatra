import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            E
          </span>
          <span>
            Ekamatra<span className="text-brand">Tukang</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/cari" className="hover:text-brand">
            Cari Tukang
          </Link>
          <Link href="/jadi-mitra" className="hover:text-brand">
            Jadi Mitra
          </Link>
          <Link href="/#cara-kerja" className="hover:text-brand">
            Cara Kerja
          </Link>
        </nav>
        <Link
          href="/cari"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Cari Tukang
        </Link>
      </div>
    </header>
  );
}
