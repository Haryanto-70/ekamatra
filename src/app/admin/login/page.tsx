import AdminLoginForm from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-24">
      <h1 className="text-2xl font-bold text-[#0f172a]">Admin Login</h1>
      <p className="mt-1 text-sm text-slate-500">
        Masuk untuk kelola lead, booking, dan mitra.
      </p>
      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <AdminLoginForm />
      </div>
    </div>
  );
}
