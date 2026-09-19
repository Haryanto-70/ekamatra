import { adminWaLink } from "@/lib/whatsapp";

export default function FloatingWaButton() {
  const href = adminWaLink("Halo, saya butuh bantuan mencari tukang.");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-105"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.9.53 3.68 1.44 5.2L2 22l5.02-1.55a9.9 9.9 0 0 0 5.02 1.36c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 17.9a8 8 0 0 1-4.08-1.12l-.29-.17-3.03.94.95-2.95-.19-.3a7.94 7.94 0 0 1-1.23-4.39c0-4.4 3.58-7.98 7.98-7.98 4.4 0 7.98 3.58 7.98 7.98 0 4.4-3.58 7.99-7.98 7.99zm4.36-5.96c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.17-.7-.62-1.17-1.39-1.31-1.63-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.03-.42-.08-.12-.34-.82-.56-1.36-.15-.36-.31-.31-.43-.32-.11-.01-.24-.01-.37-.01-.13 0-.34.05-.52.24-.18.19-.7.68-.7 1.66 0 .98.72 1.93.82 2.06.1.14 1.4 2.14 3.39 2.92 1.99.78 1.99.52 2.35.49.36-.03 1.16-.47 1.32-.93.16-.46.16-.85.11-.93-.05-.08-.19-.13-.43-.25z" />
      </svg>
      Chat WhatsApp
    </a>
  );
}
