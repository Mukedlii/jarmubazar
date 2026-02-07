"use client";

import { useState } from "react";

import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>("");

  if (sent) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Köszi!</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {isSupabaseConfigured
            ? "Küldtünk egy belépő linket az emailedre."
            : "Ez most demo UI: Supabase env varok hiányoznak, így nem tudunk még e-mailt küldeni."}
        </p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
          Ha a levél nem érkezik meg, nézd meg a spam/promóciók mappát is.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Bejelentkezés</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Magic link emaillel.</p>

      {!isSupabaseConfigured && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-200">
          Supabase nincs beállítva (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY). Otthon 10 perc alatt bekötjük.
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");

          if (!isSupabaseConfigured) {
            setSent(true);
            return;
          }

          const redirectTo = `${window.location.origin}/auth/callback`;
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: redirectTo },
          });

          if (error) {
            setError(error.message);
            return;
          }

          setSent(true);
        }}
        className="mt-5 space-y-3"
      >
        <input
          type="email"
          placeholder="Email"
          className={inputClass}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
