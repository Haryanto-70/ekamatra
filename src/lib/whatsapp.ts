export function normalizePhoneToWa(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return digits;
}

export function buildWaLink(phone: string, message: string): string {
  const number = normalizePhoneToWa(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function adminWaLink(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER ?? "";
  return buildWaLink(number, message);
}
