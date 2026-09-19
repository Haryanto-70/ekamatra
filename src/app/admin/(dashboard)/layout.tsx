import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { adminLogoutAction } from "@/app/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  return (
    <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
      <aside className="w-52 shrink-0">
        <p className="mb-4 text-sm text-slate-500">Halo, {session?.name ?? "Admin"}</p>
        <nav className="flex flex-col gap-1 text-sm font-medium">
          <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-slate-100">
            Dashboard
          </Link>
          <Link href="/admin/leads" className="rounded-lg px-3 py-2 hover:bg-slate-100">
            Leads
          </Link>
          <Link href="/admin/bookings" className="rounded-lg px-3 py-2 hover:bg-slate-100">
            Booking
          </Link>
          <Link href="/admin/mitra" className="rounded-lg px-3 py-2 hover:bg-slate-100">
            Mitra
          </Link>
        </nav>
        <form action={adminLogoutAction} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:border-red-300 hover:text-red-600"
          >
            Keluar
          </button>
        </form>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
