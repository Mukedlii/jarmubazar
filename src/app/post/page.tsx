"use client";

import { useMemo, useState } from "react";

import { TurnstileWidget } from "@/components/TurnstileWidget";
import { CAR_BRANDS, listings } from "@/lib/mockData";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500";

function toInt(v: string) {
  const n = parseInt(v);
  return Number.isFinite(n) ? n : undefined;
}

export default function PostPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>("");

  // Honeypot: bots tend to fill every field. Real users never see this.
  const [website, setWebsite] = useState<string>("");

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const [category, setCategory] = useState<"Autó" | "Motor" | "Alkatrész">("Autó");

  // common
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // car fields
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [modelOther, setModelOther] = useState("");
  const [year, setYear] = useState("");
  const [km, setKm] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [hungarianPlates, setHungarianPlates] = useState<string>(""); // any|yes|no

  const modelsForBrand = useMemo(() => {
    const set = new Set<string>();
    listings
      .filter((l) => l.category === "Autó" && l.brand === brand && l.model)
      .forEach((l) => set.add(l.model!));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "hu"));
  }, [brand]);

  const showModelOther = brand && modelsForBrand.length === 0;

  if (submitted) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Köszönjük!</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          A hirdetésed beküldve. Jóváhagyás után megjelenik a böngészésben.
        </p>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
          Megjegyzés: ez most demo (mentés Supabase-be a következő lépés).
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Hirdetés feladása</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Töltsd ki a fő adatokat — autóknál a részletes mezők segítenek, hogy könnyebben megtaláljanak.
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");

          // Honeypot tripped
          if (website.trim().length > 0) {
            setError("Sikertelen beküldés (spam védelem). Próbáld újra.");
            return;
          }

          // basic validation
          const p = toInt(price);
          const y = toInt(year);
          const k = toInt(km);

          if (p == null || p <= 0) {
            setError("Kérlek adj meg érvényes árat.");
            return;
          }

          if (category === "Autó") {
            if (!brand) {
              setError("Válassz márkát.");
              return;
            }
            if (!model && !modelOther) {
              setError("Válassz típust, vagy add meg kézzel.");
              return;
            }
            if (y != null && (y < 1950 || y > new Date().getFullYear() + 1)) {
              setError("Évjárat nem tűnik valósnak.");
              return;
            }
            if (k != null && k < 0) {
              setError("Km óra állás nem lehet negatív.");
              return;
            }
          }

          // Optional Turnstile check (server-side verify)
          if (turnstileSiteKey) {
            const tokenEl = document.querySelector(
              'textarea[name="cf-turnstile-response"]'
            ) as HTMLTextAreaElement | null;
            const token = tokenEl?.value;

            if (!token) {
              setError("Kérlek igazold, hogy nem vagy robot.");
              return;
            }

            const r = await fetch("/api/turnstile/verify", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ token }),
            });

            if (!r.ok) {
              setError("Robot ellenőrzés sikertelen. Próbáld újra.");
              return;
            }
          }

          setSubmitted(true);
        }}
        className="mt-6 space-y-6"
      >
        {/* Honeypot (hidden) */}
        <div style={{ position: "absolute", left: -10000, top: "auto", width: 1, height: 1, overflow: "hidden" }} aria-hidden>
          <label>
            Website
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>
        </div>

        {/* Base */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">Hirdetés címe</label>
            <input
              type="text"
              placeholder="Pl. Audi A4 2.0 TDI S-line"
              className={inputClass}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">Kategória</label>
            <select
              className={inputClass}
              value={category}
              onChange={(e) => {
                const v = e.target.value as "Autó" | "Motor" | "Alkatrész";
                setCategory(v);
                if (v !== "Autó") {
                  setBrand("");
                  setModel("");
                  setModelOther("");
                  setYear("");
                  setKm("");
                  setFuel("");
                  setTransmission("");
                  setBodyType("");
                  setHungarianPlates("");
                }
              }}
              required
            >
              <option value="Autó">Autó</option>
              <option value="Motor">Motor</option>
              <option value="Alkatrész">Alkatrész</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">Ár (Ft)</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Pl. 1 990 000"
              className={inputClass}
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">Település</label>
            <input
              type="text"
              placeholder="Pl. Tatabánya"
              className={inputClass}
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">Leírás</label>
            <textarea
              placeholder="Írj pár mondatot az állapotról, extrákról, szervizelésről..."
              className={`${inputClass} h-32 resize-none`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Car details */}
        {category === "Autó" && (
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/20">
            <div className="mb-3">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Autó adatok</div>
              <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Ezek alapján működik a márka/típus/év/km szűrés a böngészésnél.
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">Márka</label>
                <select
                  className={inputClass}
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setModel("");
                    setModelOther("");
                  }}
                  required
                >
                  <option value="">Válassz márkát…</option>
                  {CAR_BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">Típus</label>
                {!showModelOther ? (
                  <select
                    className={inputClass}
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    disabled={!brand}
                    required
                  >
                    <option value="">Válassz típust…</option>
                    {modelsForBrand.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Pl. A4 / Octavia / Golf"
                    className={inputClass}
                    value={modelOther}
                    onChange={(e) => setModelOther(e.target.value)}
                    required
                  />
                )}
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  Ha a típuslista üres, kézzel megadható (később bővítjük teljes listára).
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">Évjárat</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Pl. 2012"
                  className={inputClass}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">Km óra állás</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Pl. 185000"
                  className={inputClass}
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">Üzemanyag</label>
                <select className={inputClass} value={fuel} onChange={(e) => setFuel(e.target.value)}>
                  <option value="">–</option>
                  <option value="Benzin">Benzin</option>
                  <option value="Dízel">Dízel</option>
                  <option value="Hibrid">Hibrid</option>
                  <option value="Elektromos">Elektromos</option>
                  <option value="LPG">LPG</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">Váltó</label>
                <select className={inputClass} value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                  <option value="">–</option>
                  <option value="Manuális">Manuális</option>
                  <option value="Automata">Automata</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">Karosszéria</label>
                <select className={inputClass} value={bodyType} onChange={(e) => setBodyType(e.target.value)}>
                  <option value="">–</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Kombi">Kombi</option>
                  <option value="Ferdehátú">Ferdehátú</option>
                  <option value="SUV">SUV</option>
                  <option value="Coupé">Coupé</option>
                  <option value="Egyterű">Egyterű</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Kisbusz">Kisbusz</option>
                  <option value="Cabrio">Cabrio</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100">Magyar forgalomban</label>
                <select
                  className={inputClass}
                  value={hungarianPlates}
                  onChange={(e) => setHungarianPlates(e.target.value)}
                >
                  <option value="">–</option>
                  <option value="yes">Igen</option>
                  <option value="no">Nem (külföldi)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Upload placeholder */}
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300">
          Képfeltöltés (drag &amp; drop) — Supabase Storage után
        </div>

        {turnstileSiteKey && (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <TurnstileWidget siteKey={turnstileSiteKey} />
          </div>
        )}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          Beküldés jóváhagyásra
        </button>
      </form>
    </div>
  );
}
