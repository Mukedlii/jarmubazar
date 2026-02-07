"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500";

export default function LoginPage() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Köszi!</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Küldtünk egy belépő linket az emailedre.</p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
          Megjegyzés: ez most demo UI — a valódi e-mail küldés Supabase/SMTP beállítás után fog működni.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Bejelentkezés</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Magic link emaillel (MVP-ben demo).</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="mt-5 space-y-3"
      >
        <input type="email" placeholder="Email" className={inputClass} required />
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
        >
          Belépő link küldése
        </button>
      </form>
    </div>
  );
}
