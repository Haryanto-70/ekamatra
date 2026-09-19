"use client";

import { useActionState, useEffect } from "react";
import { createBookingAction, type ActionResult } from "@/app/actions";

const initialState: ActionResult | null = null;

export default function BookingForm({ serviceId }: { serviceId: string }) {
  const [state, formAction, pending] = useActionState(createBookingAction, initialState);

  useEffect(() => {
    if (state?.ok && state.waLink) {
      window.open(state.waLink, "_blank");
    }
  }, [state]);

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
        <p className="font-semibold text-emerald-700">
          Booking berhasil dibuat! Mitra akan segera dihubungi via WhatsApp.
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
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="serviceId" value={serviceId} />

      <label className="text-sm font-medium text-slate-700">
        Nama Lengkap
        <input
          name="customerName"
          required
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </label>

      <label className="text-sm font-medium text-slate-700">
        Nomor WhatsApp
        <input
          name="customerPhone"
          required
          placeholder="08xxxxxxxxxx"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </label>

      <label className="text-sm font-medium text-slate-700">
        Tanggal & Jam Pengerjaan
        <input
          type="datetime-local"
          name="scheduledAt"
          required
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </label>

      <label className="text-sm font-medium text-slate-700">
        Alamat Lengkap
        <textarea
          name="address"
          required
          rows={2}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </label>

      <label className="text-sm font-medium text-slate-700">
        Catatan Tambahan (opsional)
        <textarea
          name="notes"
          rows={2}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </label>

      {state && !state.ok && (
        <p className="text-sm font-medium text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Memproses..." : "Konfirmasi Booking"}
      </button>
    </form>
  );
}
