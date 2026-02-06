"use client";

import { useState } from "react";

import { mockData } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

export default function Page() {
  const [items, setItems] = useState(mockData);

  function handleAction(id: string, _action: "approve" | "reject") {
    // UI-only: eltávolítjuk az elemet a listából
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded">
        <strong>Figyelem:</strong> Csak adminnak hozzáférhető felület.
      </div>

      <h1 className="text-2xl font-semibold text-gray-900">Jóváhagyásra váró hirdetések</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Cím</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Ár</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Település</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Beküldve</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Művelet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">{item.title}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{formatPrice(item.price)}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{item.location}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{item.time}</td>
                <td className="px-4 py-2 text-sm text-gray-900 text-right space-x-2">
                  <button
                    onClick={() => handleAction(item.id, "approve")}
                    className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(item.id, "reject")}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                  Nincs több jóváhagyásra váró hirdetés.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
