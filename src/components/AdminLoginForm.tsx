"use client";

import { useActionState } from "react";
import { adminLoginAction, type ActionResult } from "@/app/actions";

const initialState: ActionResult | null = null;

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLoginAction, initialState);

  return (
    <form action={formAction} className="grid gap-3">
      <label className="text-sm font-medium text-slate-700">
        Nomor Telepon
        <input
          name="phone"
          required
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </label>
      <label className="text-sm font-medium text-slate-700">
        Password
        <input
          type="password"
          name="password"
          required
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
        {pending ? "Masuk..." : "Masuk"}
      </button>
    </form>
  );
}
