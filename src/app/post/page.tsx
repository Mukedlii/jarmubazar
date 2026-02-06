"use client";

import { useState } from "react";

export default function Page() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Hirdetés feladása</h1>
      {submitted ? (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
          <h2 className="font-semibold mb-2">Köszi!</h2>
          <p>A hirdetésed jóváhagyás után megjelenik.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Cím</label>
            <input type="text" required className="border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Kategória</label>
            <select required className="border rounded px-3 py-2">
              <option value="">Válassz</option>
              <option value="Autó">Autó</option>
              <option value="Motor">Motor</option>
              <option value="Alkatrész">Alkatrész</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Ár (Ft)</label>
            <input type="number" required className="border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Település</label>
            <input type="text" required className="border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Leírás</label>
            <textarea required rows={4} className="border rounded px-3 py-2"></textarea>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Képfeltöltés</label>
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded px-4 py-6 text-center text-gray-500">
              Drag &amp; drop vagy kattints a kép kiválasztásához (nem történik valódi feltöltés)
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors">
            Beküldés jóváhagyásra
          </button>
        </form>
      )}
    </div>
  );
}
