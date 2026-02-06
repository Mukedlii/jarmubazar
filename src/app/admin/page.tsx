"use client";

import { useState } from "react";

import { listings } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

export default function AdminPage() {
  const [pending, setPending] = useState(listings);

  function approve(id: number) {
    setPending((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-red-100 text-red-700 p-2 rounded mb-4">Csak adminnak! (UI csak demó)</div>

      <h1 className="text-2xl font-bold mb-4">Jóváhagyásra váró hirdetések</h1>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Cím</th>
            <th className="p-2 border">Ár</th>
            <th className="p-2 border">Település</th>
            <th className="p-2 border">Beküldve</th>
            <th className="p-2 border">Művelet</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((item) => (
            <tr key={item.id}>
              <td className="p-2 border">{item.title}</td>
              <td className="p-2 border">{formatPrice(item.price)}</td>
              <td className="p-2 border">{item.location}</td>
              <td className="p-2 border">{item.posted}</td>
              <td className="p-2 border">
                <button onClick={() => approve(item.id)} className="bg-green-600 text-white px-2 py-1 rounded mr-2">
                  Approve
                </button>
                <button onClick={() => approve(item.id)} className="bg-red-600 text-white px-2 py-1 rounded">
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
