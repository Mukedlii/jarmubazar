"use client";

import { useEffect, useState } from "react";

import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

const CATEGORIES = ["Autó", "Motor", "Alkatrész"] as const;

type Sub = {
  enabled: boolean;
  valid_until: string | null;
  price_min: number | null;
  price_max: number | null;
  categories: string[] | null;
  hungarian_plates_only: boolean;
  email_enabled: boolean;
  telegram_enabled: boolean;
  telegram_chat_id: string | null;
} | null;

export default function AlertsPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const [sub, setSub] = useState<Sub>(null);

  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [cats, setCats] = useState<string[]>([...CATEGORIES]);
  const [hpOnly, setHpOnly] = useState(false);

  const [emailEnabled, setEmailEnabled] = useState(true);
  const [telegramEnabled, setTelegramEnabled] = useState(false);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError("");
      setOkMsg("");

      if (!isSupabaseConfigured) {
        setError("A funkció jelenleg nem elérhető.");
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (!alive) return;

      const session = sessionData.session;
      setAuthed(Boolean(session));
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/alerts/me", {
          headers: { authorization: `Bearer ${session.access_token}` },
        });
        const j = await res.json();
        if (!alive) return;

        if (!j.ok) throw new Error(j.error ?? "Sikertelen betöltés");
        setSub(j.subscription);

        const s: Sub = j.subscription;
        if (s) {
          setPriceMin(s.price_min != null ? String(s.price_min) : "");
          setPriceMax(s.price_max != null ? String(s.price_max) : "");
          setCats(s.categories && s.categories.length ? s.categories : [...CATEGORIES]);
          setHpOnly(Boolean(s.hungarian_plates_only));
          setEmailEnabled(s.email_enabled !== false);
          setTelegramEnabled(Boolean(s.telegram_enabled));
        }
      } catch (e: any) {
        setError(e?.message ?? "Sikertelen betöltés");
      } finally {
        setLoading(false);
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, []);

  if (!authed) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Értesítések</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Csak bejelentkezve.</p>
        <a
          href="/login"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
        >
          Bejelentkezés
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Új hirdetés értesítések</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Értesítést kapsz, amikor admin jóváhagy egy új hirdetést, ami illik a szűrőidre.</p>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-200">
          {error}
        </div>
      )}
      {okMsg && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-200">
          {okMsg}
        </div>
      )}

      {loading ? (
        <div className="mt-4 text-slate-600 dark:text-slate-400">Betöltés…</div>
      ) : (
        <form
          className="mt-6 space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            setError("");
            setOkMsg("");

            try {
              const { data: sessionData } = await supabase.auth.getSession();
              const token = sessionData.session?.access_token;
              if (!token) throw new Error("Not authenticated");

              const res = await fetch("/api/alerts/subscribe", {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  priceMin,
                  priceMax,
                  categories: cats,
                  hungarianPlatesOnly: hpOnly,
                  emailEnabled,
                  telegramEnabled,
                }),
              });

              const j = await res.json();
              if (!j.ok) {
                if (j.error === "trial_expired") {
                  throw new Error("Lejárt a 7 napos próbaidő. (Fizetős lesz)");
                }
                throw new Error(j.error ?? "Sikertelen mentés");
              }

              setOkMsg(`Mentve. Ingyenes próba eddig: ${new Date(j.validUntil).toLocaleString("hu-HU")}`);
            } catch (e: any) {
              setError(e?.message ?? "Sikertelen mentés");
            } finally {
              setSaving(false);
            }
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Ár min (Ft)</label>
              <input
                type="number"
                inputMode="numeric"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="pl. 100000"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Ár max (Ft)</label>
              <input
                type="number"
                inputMode="numeric"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="pl. 500000"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">Kategóriák</div>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((c) => {
                const checked = cats.includes(c);
                return (
                  <label key={c} className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) setCats((p) => Array.from(new Set([...p, c])));
                        else setCats((p) => p.filter((x) => x !== c));
                      }}
                    />
                    {c}
                  </label>
                );
              })}
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={hpOnly} onChange={(e) => setHpOnly(e.target.checked)} />
            Csak magyar forgalomban
          </label>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/30">
            <div className="font-semibold text-slate-900 dark:text-slate-100">Értesítési csatornák</div>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} />
                <span>Email</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={telegramEnabled} onChange={(e) => setTelegramEnabled(e.target.checked)} />
                <span>Telegram (összekötés később)</span>
              </label>
              {sub?.telegram_chat_id ? (
                <div className="text-xs text-slate-500 dark:text-slate-400">Telegram összekötve: {sub.telegram_chat_id}</div>
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400">Telegram nincs összekötve.</div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {saving ? "Mentés…" : "Mentés"}
          </button>

          {sub?.valid_until && (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Jelenlegi hozzáférés eddig: {new Date(sub.valid_until).toLocaleString("hu-HU")}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
