"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getReceivedOffers } from "@/lib/offersRepo";
import { formatPrice } from "@/lib/utils";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

type Row = {
  id: string;
  created_at: string;
  offer_price: number;
  message: string | null;
  status: string;
  counter_price: number | null;
  listing_id: string;
  listings?: {
    id: string;
    title: string;
    price: number;
  } | null;
};

export default function OffersPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError("");

      if (!isSupabaseConfigured) {
        setLoading(false);
        setError("A funkció jelenleg nem elérhető.");
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (!alive) return;

      const ok = Boolean(sessionData.session);
      setAuthed(ok);
      if (!ok) {
        setLoading(false);
        return;
      }

      try {
        const data = await getReceivedOffers();
        if (!alive) return;
        setRows(data as any);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Sikertelen betöltés.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();

    // Realtime: if a new offer arrives, refetch list.
    if (isSupabaseConfigured) {
      const ch = supabase
        .channel("offers-inbox")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "offers" },
          async () => {
            try {
              const data = await getReceivedOffers();
              if (!alive) return;
              setRows(data as any);
            } catch {
              // ignore
            }
          }
        )
        .subscribe();

      return () => {
        alive = false;
        supabase.removeChannel(ch);
      };
    }

    return () => {
      alive = false;
    };
  }, []);

  if (!authed) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Ajánlatok</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Csak bejelentkezve.</p>
        <Link
          href="/login"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
        >
          Bejelentkezés
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Beérkezett ajánlatok</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Eladóként / adminként itt látod a hirdetéseidre érkezett ajánlatokat.</p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-4 text-slate-600 dark:text-slate-400">Betöltés…</div>
        ) : rows.length === 0 ? (
          <div className="mt-4 text-slate-600 dark:text-slate-400">Még nincs ajánlat.</div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border text-sm dark:border-slate-800">
              <thead>
                <tr className="bg-slate-50 text-left dark:bg-slate-900/30">
                  <th className="p-2 border dark:border-slate-800">Hirdetés</th>
                  <th className="p-2 border dark:border-slate-800">Ajánlat</th>
                  <th className="p-2 border dark:border-slate-800">Üzenet</th>
                  <th className="p-2 border dark:border-slate-800">Státusz</th>
                  <th className="p-2 border dark:border-slate-800">Idő</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="align-top">
                    <td className="p-2 border dark:border-slate-800">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        <Link href={`/listing/${r.listing_id}`} className="underline hover:text-blue-600">
                          {r.listings?.title ?? "Hirdetés"}
                        </Link>
                      </div>
                      {r.listings?.price != null && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">Ár: {formatPrice(r.listings.price)}</div>
                      )}
                    </td>
                    <td className="p-2 border dark:border-slate-800 font-semibold text-slate-900 dark:text-slate-100">
                      {formatPrice(r.offer_price)}
                    </td>
                    <td className="p-2 border dark:border-slate-800 text-slate-700 dark:text-slate-300">{r.message ?? "–"}</td>
                    <td className="p-2 border dark:border-slate-800 text-slate-700 dark:text-slate-300">{r.status}</td>
                    <td className="p-2 border dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      {r.created_at ? new Date(r.created_at).toLocaleString("hu-HU") : "–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
