import Link from "next/link";

import { APP } from "@/lib/config";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{APP.name}</h1>
          <p className="mt-2 text-slate-600">
            Jármű hirdetések – {APP.region}. (MVP)
          </p>
        </header>

        <section className="space-y-3 rounded-xl border p-5">
          <h2 className="text-lg font-semibold">Mit tud most?</h2>
          <ul className="list-disc space-y-1 pl-5 text-slate-700">
            <li>Mobilbarát webapp (PWA alap).</li>
            <li>Email magic link bejelentkezés (később bekötjük Supabase-szal).</li>
            <li>Hirdetés feladás + admin jóváhagyás (pending → approved).</li>
            <li>Értesítések: Web Push + Email (SMS később).</li>
          </ul>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/browse"
            className="rounded-xl bg-slate-900 px-5 py-4 text-center font-semibold text-white hover:bg-slate-800"
          >
            Böngészés
          </Link>
          <Link
            href="/post"
            className="rounded-xl border px-5 py-4 text-center font-semibold hover:bg-slate-50"
          >
            Hirdetés feladás
          </Link>
        </section>

        <footer className="mt-10 text-sm text-slate-500">
          Admin: {APP.adminEmail}
        </footer>
      </div>
    </main>
  );
}
