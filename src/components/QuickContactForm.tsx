"use client";

import { useActionState, useEffect } from "react";
import { createLeadAction, type ActionResult } from "@/app/actions";

type Category = { id: string; name: string };

const initialState: ActionResult | null = null;

export default function QuickContactForm({
  categories,
  heading = "Butuh tukang cepat? Isi form ini",
  subheading = "Kami akan menghubungkan Anda via WhatsApp dalam hitungan menit.",
  categoryLabel = "Jenis kebutuhan (opsional)",
  messagePlaceholder = "Ceritakan kebutuhan Anda (opsional)",
}: {
  categories: Category[];
  heading?: string;
  subheading?: string;
  categoryLabel?: string;
  messagePlaceholder?: string;
}) {
  const [state, formAction, pending] = useActionState(createLeadAction, initialState);

  useEffect(() => {
    if (state?.ok && state.waLink) {
      window.open(state.waLink, "_blank");
    }
  }, [state]);

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
        <p className="font-semibold text-emerald-700">
          Permintaan Anda terkirim! Tim kami akan menghubungi via WhatsApp.
        </p>
        <p className="mt-1 text-sm text-emerald-600">
          Jika jendela WhatsApp tidak terbuka otomatis,{" "}
          <a href={state.waLink} target="_blank" className="underline">
            klik di sini
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <h3 className="text-lg font-bold text-[#0f172a]">{heading}</h3>
        <p className="text-sm text-slate-500">{subheading}</p>
      </div>

      <input
        name="name"
        required
        placeholder="Nama Anda"
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
      />
      <input
        name="phone"
        required
        placeholder="Nomor WhatsApp (08xxx)"
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
      />
      <input
        name="city"
        placeholder="Kota/Kecamatan"
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
      />
      <select
        name="categoryId"
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
        defaultValue=""
      >
        <option value="">{categoryLabel}</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <textarea
        name="message"
        placeholder={messagePlaceholder}
        rows={2}
        className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
      />

      {state && !state.ok && (
        <p className="sm:col-span-2 text-sm font-medium text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="sm:col-span-2 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Mengirim..." : "Hubungi via WhatsApp"}
      </button>
    </form>
  );
}
