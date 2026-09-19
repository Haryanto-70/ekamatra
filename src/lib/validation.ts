import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().min(9, "Nomor WhatsApp tidak valid"),
  city: z.string().optional(),
  categoryId: z.string().optional(),
  message: z.string().optional(),
});

export const bookingSchema = z.object({
  serviceId: z.string().min(1),
  customerName: z.string().min(2, "Nama minimal 2 karakter"),
  customerPhone: z.string().min(9, "Nomor WhatsApp tidak valid"),
  scheduledAt: z.string().min(1, "Pilih tanggal & jam"),
  address: z.string().min(5, "Alamat wajib diisi"),
  notes: z.string().optional(),
});

export const adminLoginSchema = z.object({
  phone: z.string().min(1),
  password: z.string().min(1),
});
