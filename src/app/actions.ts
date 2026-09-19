"use server";

import { prisma } from "@/lib/prisma";
import { leadSchema, bookingSchema, adminLoginSchema } from "@/lib/validation";
import { createAdminSession, clearAdminSession, getAdminSession } from "@/lib/auth";
import { adminWaLink, buildWaLink } from "@/lib/whatsapp";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionResult = {
  ok: boolean;
  error?: string;
  waLink?: string;
};

export async function createLeadAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    city: formData.get("city") || undefined,
    categoryId: formData.get("categoryId") || undefined,
    message: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const data = parsed.data;

  const lead = await prisma.lead.create({
    data: {
      name: data.name,
      phone: data.phone,
      city: data.city,
      categoryId: data.categoryId,
      message: data.message,
      source: "QUICK_CONTACT",
    },
  });

  const waMessage = `Halo, saya ${data.name} (${data.phone}) butuh bantuan tukang${
    data.city ? ` di ${data.city}` : ""
  }.${data.message ? ` Detail: ${data.message}` : ""} [Lead #${lead.id.slice(-6)}]`;

  revalidatePath("/admin/leads");

  return { ok: true, waLink: adminWaLink(waMessage) };
}

export async function createBookingAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = bookingSchema.safeParse({
    serviceId: formData.get("serviceId"),
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    scheduledAt: formData.get("scheduledAt"),
    address: formData.get("address"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const data = parsed.data;

  const service = await prisma.service.findUnique({
    where: { id: data.serviceId },
    include: { mitra: true },
  });

  if (!service) {
    return { ok: false, error: "Layanan tidak ditemukan" };
  }

  let customer = await prisma.user.findUnique({ where: { phone: data.customerPhone } });
  if (!customer) {
    customer = await prisma.user.create({
      data: {
        name: data.customerName,
        phone: data.customerPhone,
        role: "CUSTOMER",
      },
    });
  }

  const booking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      mitraId: service.mitraId,
      serviceId: service.id,
      scheduledAt: new Date(data.scheduledAt),
      address: data.address,
      notes: data.notes,
      estimatedPriceMin: service.priceMin,
      estimatedPriceMax: service.priceMax,
    },
  });

  const waMessage = `Halo ${service.mitra.businessName}, saya ${data.customerName} ingin booking "${service.title}" pada ${new Date(
    data.scheduledAt
  ).toLocaleString("id-ID")}. Alamat: ${data.address}. [Booking #${booking.id.slice(-6)}]`;

  revalidatePath("/admin/bookings");

  return { ok: true, waLink: buildWaLink(service.mitra.whatsappNumber, waMessage) };
}

export async function adminLoginAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = adminLoginSchema.safeParse({
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Data tidak valid" };
  }

  const user = await prisma.user.findUnique({ where: { phone: parsed.data.phone } });
  if (!user || user.role !== "ADMIN" || !user.passwordHash) {
    return { ok: false, error: "Nomor atau password salah" };
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { ok: false, error: "Nomor atau password salah" };
  }

  await createAdminSession({ userId: user.id, name: user.name, role: "ADMIN" });
  redirect("/admin");
}

export async function adminLogoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function updateLeadStatusAction(leadId: string, status: string) {
  const session = await getAdminSession();
  if (!session) return;
  await prisma.lead.update({ where: { id: leadId }, data: { status: status as never } });
  revalidatePath("/admin/leads");
}

export async function updateBookingStatusAction(bookingId: string, status: string) {
  const session = await getAdminSession();
  if (!session) return;
  await prisma.booking.update({ where: { id: bookingId }, data: { status: status as never } });
  revalidatePath("/admin/bookings");
}
