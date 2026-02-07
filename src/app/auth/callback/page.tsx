"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      try {
        if (!isSupabaseConfigured) {
          setStatus("error");
          setMessage("Supabase nincs beállítva (hiányzó env varok). ");
          return;
        }

        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (!code) {
          setStatus("error");
          setMessage("Hiányzó auth code. Próbáld újra a belépést.");
          return;
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }

        setStatus("ok");
        setMessage("Sikeres belépés.");
      } catch (e) {
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Ismeretlen hiba");
      }
    };

    void run();
  }, []);

  return (
    <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Beléptetés</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        {status === "loading" ? "Beléptetés folyamatban…" : message}
      </p>

      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="rounded-xl border px-4 py-2 font-semibold text-slate-900 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-900">
          Főoldal
        </Link>
        <Link href="/browse" className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800">
          Böngészés
        </Link>
      </div>
    </div>
  );
}
