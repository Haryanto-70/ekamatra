import { prisma } from "@/lib/prisma";
import { updateLeadStatusAction } from "@/app/actions";
import StatusSelect from "@/components/StatusSelect";
import { buildWaLink } from "@/lib/whatsapp";

export const revalidate = 0;

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0f172a]">Leads</h1>
      <p className="mt-1 text-slate-500">Semua permintaan customer masuk</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Kontak</th>
              <th className="px-4 py-3">Kota</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Pesan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3 font-medium text-[#0f172a]">{l.name}</td>
                <td className="px-4 py-3">
                  <a
                    href={buildWaLink(l.phone, `Halo ${l.name}, terkait permintaan Anda...`)}
                    target="_blank"
                    className="text-brand hover:underline"
                  >
                    {l.phone}
                  </a>
                </td>
                <td className="px-4 py-3 text-slate-500">{l.city ?? "-"}</td>
                <td className="px-4 py-3 text-slate-500">{l.category?.name ?? "-"}</td>
                <td className="px-4 py-3 max-w-xs truncate text-slate-500">{l.message ?? "-"}</td>
                <td className="px-4 py-3">
                  <StatusSelect
                    id={l.id}
                    status={l.status}
                    kind="lead"
                    onUpdate={updateLeadStatusAction}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                  {l.createdAt.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <p className="p-6 text-center text-slate-400">Belum ada lead.</p>
        )}
      </div>
    </div>
  );
}
