import { APP } from "@/lib/config";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="text-2xl font-bold">Admin (MVP)</h1>
        <p className="mt-2 text-slate-600">
          Admin jóváhagyás (pending → approved) itt lesz. Első admin email: <b>{APP.adminEmail}</b>.
        </p>
      </div>
    </main>
  );
}
