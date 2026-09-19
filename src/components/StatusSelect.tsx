"use client";

import { useTransition } from "react";

const LEAD_STATUSES = ["NEW", "CONTACTED", "CONVERTED", "CLOSED"];
const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function StatusSelect({
  id,
  status,
  kind,
  onUpdate,
}: {
  id: string;
  status: string;
  kind: "lead" | "booking";
  onUpdate: (id: string, status: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const options = kind === "lead" ? LEAD_STATUSES : BOOKING_STATUSES;

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => startTransition(() => onUpdate(id, e.target.value))}
      className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium outline-none focus:border-brand disabled:opacity-60"
    >
      {options.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
