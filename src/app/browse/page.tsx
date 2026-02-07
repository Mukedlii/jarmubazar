"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { listings } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

const CARD_IMAGES = ["/assets/car1.png", "/assets/car2.png", "/assets/car3.png"];

export default function BrowsePage() {
  const [category, setCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");

  const items = useMemo(() => {
    const filtered = listings.filter((item) => {
      if (category && item.category !== category) return false;
      if (minPrice && item.price < parseInt(minPrice)) return false;
      if (maxPrice && item.price > parseInt(maxPrice)) return false;
      if (location && !item.location.toLowerCase().includes(location.toLowerCase())) return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      // MVP: newest = keep mock ordering
      return 0;
    });

    return sorted;
  }, [category, minPrice, maxPrice, location, sort]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Böngészés</h1>
          <p className="mt-1 text-slate-600">Szűrj gyorsan, és nézd a legfrissebb hirdetéseket.</p>
        </div>
        <Link href="/post" className="hidden rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 sm:inline-flex">
          + Hirdetés feladás
        </Link>
      </div>

      <div className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        <select
          className="w-full rounded-xl border px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Kategória</option>
          <option value="Autó">Autó</option>
          <option value="Motor">Motor</option>
          <option value="Alkatrész">Alkatrész</option>
        </select>

        <input
          type="number"
          placeholder="Min. ár"
          className="w-full rounded-xl border px-3 py-2"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max. ár"
          className="w-full rounded-xl border px-3 py-2"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <input
          type="text"
          placeholder="Település"
          className="w-full rounded-xl border px-3 py-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          className="w-full rounded-xl border px-3 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Legújabb</option>
          <option value="price">Ár szerint</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <Link
            key={item.id}
            href={`/listing/${item.id}`}
            className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-[16/9] bg-slate-100">
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
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold leading-snug text-slate-900 line-clamp-2">
                  {item.title}
                </h2>
              </div>

              <div className="mt-2 text-lg font-bold text-blue-700">{formatPrice(item.price)}</div>

              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <div className="truncate">{item.location}</div>
                <div className="shrink-0">{item.posted}</div>
              </div>

              <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {item.category}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="sm:hidden">
        <Link href="/post" className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800">
          + Hirdetés feladás
        </Link>
      </div>
    </div>
  );
}
