"use client";

import { useState } from "react";
import Link from "next/link";

import { listings } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

export default function BrowsePage() {
  const [category, setCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [sort, setSort] = useState<string>("");

  const filtered = listings.filter((item) => {
    if (category && item.category !== category) return false;
    if (minPrice && item.price < parseInt(minPrice)) return false;
    if (maxPrice && item.price > parseInt(maxPrice)) return false;
    if (location && !item.location.toLowerCase().includes(location.toLowerCase())) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price") return a.price - b.price;
    if (sort === "newest") return 0;
    return 0;
  });

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Böngészés</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select className="border p-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Kategória</option>
          <option value="Autó">Autó</option>
          <option value="Motor">Motor</option>
          <option value="Alkatrész">Alkatrész</option>
        </select>

        <input
          type="number"
          placeholder="Min. ár"
          className="border p-2 rounded"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max. ár"
          className="border p-2 rounded"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <input
          type="text"
          placeholder="Település"
          className="border p-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          className="border p-2 rounded md:col-span-1"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Rendezés</option>
          <option value="newest">Legújabb</option>
          <option value="price">Ár szerint</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((item) => (
          <Link
            key={item.id}
            href={`/listing/${item.id}`}
            className="border rounded shadow-sm hover:shadow-md transition p-3 flex flex-col"
          >
            <div className="h-32 bg-gray-200 mb-3 flex items-center justify-center text-gray-500">Kép</div>

            {item.featured && (
              <span className="self-start bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded mb-2">Kiemelt</span>
            )}

            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-blue-600 font-bold">{formatPrice(item.price)}</p>
            <p className="text-sm text-gray-600">
              {item.location} • {item.posted}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
