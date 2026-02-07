"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { CAR_BRANDS, listings } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

const CARD_IMAGES = ["/assets/car1.png", "/assets/car2.png", "/assets/car3.png"];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500";

function toInt(v: string) {
  const n = parseInt(v);
  return Number.isFinite(n) ? n : undefined;
}

export default function BrowsePage() {
  const [category, setCategory] = useState<string>("Autó");

  // General
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");

  // Car-specific filters
  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [minYear, setMinYear] = useState<string>("");
  const [maxYear, setMaxYear] = useState<string>("");
  const [minKm, setMinKm] = useState<string>("");
  const [maxKm, setMaxKm] = useState<string>("");
  const [fuel, setFuel] = useState<string>("");
  const [transmission, setTransmission] = useState<string>("");
  const [bodyType, setBodyType] = useState<string>("");
  const [hungarianPlates, setHungarianPlates] = useState<string>(""); // any|yes|no

  const brandCounts = useMemo(() => {
    const map = new Map<string, number>();
    listings
      .filter((l) => l.category === "Autó" && l.brand)
      .forEach((l) => map.set(l.brand!, (map.get(l.brand!) ?? 0) + 1));
    return map;
  }, []);

  const modelsForBrand = useMemo(() => {
    const set = new Set<string>();
    listings
      .filter((l) => l.category === "Autó" && l.brand === brand && l.model)
      .forEach((l) => set.add(l.model!));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "hu"));
  }, [brand]);

  const items = useMemo(() => {
    const minP = toInt(minPrice);
    const maxP = toInt(maxPrice);
    const minY = toInt(minYear);
    const maxY = toInt(maxYear);
    const minK = toInt(minKm);
    const maxK = toInt(maxKm);

    const filtered = listings.filter((item) => {
      if (category && item.category !== category) return false;
      if (minP != null && item.price < minP) return false;
      if (maxP != null && item.price > maxP) return false;
      if (location && !item.location.toLowerCase().includes(location.toLowerCase())) return false;

      if (category === "Autó") {
        if (brand && item.brand !== brand) return false;
        if (model && item.model !== model) return false;
        if (minY != null && (item.year == null || item.year < minY)) return false;
        if (maxY != null && (item.year == null || item.year > maxY)) return false;
        if (minK != null && (item.km == null || item.km < minK)) return false;
        if (maxK != null && (item.km == null || item.km > maxK)) return false;
        if (fuel && item.fuel !== fuel) return false;
        if (transmission && item.transmission !== transmission) return false;
        if (bodyType && item.bodyType !== bodyType) return false;
        if (hungarianPlates === "yes" && item.hungarianPlates !== true) return false;
        if (hungarianPlates === "no" && item.hungarianPlates !== false) return false;
      }

      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      return 0;
    });

    return sorted;
  }, [
    category,
    minPrice,
    maxPrice,
    location,
    sort,
    brand,
    model,
    minYear,
    maxYear,
    minKm,
    maxKm,
    fuel,
    transmission,
    bodyType,
    hungarianPlates,
  ]);

  const showCarFilters = category === "Autó";

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Böngészés</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Szűrők (MVP bővítve hasznaltauto.hu stílusra) — még finomítjuk.
          </p>
        </div>
        <Link
          href="/post"
          className="hidden rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 sm:inline-flex"
        >
          + Hirdetés feladás
        </Link>
      </div>

      <div className="grid gap-3 rounded-2xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-2 lg:grid-cols-6">
        <select
          className={inputClass}
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            // reset car filters when leaving cars
            if (e.target.value !== "Autó") {
              setBrand("");
              setModel("");
              setMinYear("");
              setMaxYear("");
              setMinKm("");
              setMaxKm("");
              setFuel("");
              setTransmission("");
              setBodyType("");
              setHungarianPlates("");
            }
          }}
        >
          <option value="">Kategória</option>
          <option value="Autó">Autó</option>
          <option value="Motor">Motor</option>
          <option value="Alkatrész">Alkatrész</option>
        </select>

        <input
          type="number"
          inputMode="numeric"
          placeholder="Min. ár"
          className={inputClass}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          inputMode="numeric"
          placeholder="Max. ár"
          className={inputClass}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <input
          type="text"
          placeholder="Település"
          className={inputClass}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select className={inputClass} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Legújabb</option>
          <option value="price">Ár szerint</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setMinPrice("");
            setMaxPrice("");
            setLocation("");
            setSort("newest");
            setBrand("");
            setModel("");
            setMinYear("");
            setMaxYear("");
            setMinKm("");
            setMaxKm("");
            setFuel("");
            setTransmission("");
            setBodyType("");
            setHungarianPlates("");
          }}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:bg-slate-900"
        >
          Szűrők törlése
        </button>

        {showCarFilters && (
          <>
            <select className={inputClass} value={brand} onChange={(e) => {
              setBrand(e.target.value);
              setModel("");
            }}>
              <option value="">Márka</option>
              {CAR_BRANDS.map((b) => {
                const c = brandCounts.get(b) ?? 0;
                return (
                  <option key={b} value={b}>
                    {b} ({c})
                  </option>
                );
              })}
            </select>

            <select className={inputClass} value={model} onChange={(e) => setModel(e.target.value)} disabled={!brand}>
              <option value="">Típus</option>
              {modelsForBrand.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <input
              type="number"
              inputMode="numeric"
              placeholder="Min. év"
              className={inputClass}
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="Max. év"
              className={inputClass}
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
            />

            <input
              type="number"
              inputMode="numeric"
              placeholder="Min. km"
              className={inputClass}
              value={minKm}
              onChange={(e) => setMinKm(e.target.value)}
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="Max. km"
              className={inputClass}
              value={maxKm}
              onChange={(e) => setMaxKm(e.target.value)}
            />

            <select className={inputClass} value={fuel} onChange={(e) => setFuel(e.target.value)}>
              <option value="">Üzemanyag</option>
              <option value="Benzin">Benzin</option>
              <option value="Dízel">Dízel</option>
              <option value="Hibrid">Hibrid</option>
              <option value="Elektromos">Elektromos</option>
              <option value="LPG">LPG</option>
              <option value="CNG">CNG</option>
            </select>

            <select className={inputClass} value={transmission} onChange={(e) => setTransmission(e.target.value)}>
              <option value="">Váltó</option>
              <option value="Manuális">Manuális</option>
              <option value="Automata">Automata</option>
            </select>

            <select className={inputClass} value={bodyType} onChange={(e) => setBodyType(e.target.value)}>
              <option value="">Karosszéria</option>
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

            <select className={inputClass} value={hungarianPlates} onChange={(e) => setHungarianPlates(e.target.value)}>
              <option value="">Magyar forgalomban</option>
              <option value="yes">Igen</option>
              <option value="no">Nem (külföldi)
              </option>
            </select>
          </>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <Link
            key={item.id}
            href={`/listing/${item.id}`}
            className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-900">
              <Image
                src={CARD_IMAGES[idx % CARD_IMAGES.length]}
                alt={item.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
              {item.featured && (
                <div className="absolute left-3 top-3 rounded-full bg-yellow-300/90 px-3 py-1 text-xs font-semibold text-slate-900">
                  Kiemelt
                </div>
              )}
            </div>

            <div className="p-4">
              <h2 className="text-base font-semibold leading-snug text-slate-900 dark:text-slate-100 line-clamp-2">
                {item.title}
              </h2>

              <div className="mt-2 text-lg font-bold text-blue-700">{formatPrice(item.price)}</div>

              <div className="mt-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <div className="truncate">{item.location}</div>
                <div className="shrink-0">{item.posted}</div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {item.category}
                </span>
                {item.brand && (
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {item.brand}
                  </span>
                )}
                {item.model && (
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {item.model}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="sm:hidden">
        <Link
          href="/post"
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
        >
          + Hirdetés feladás
        </Link>
      </div>
    </div>
  );
}
