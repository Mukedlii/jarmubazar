"use client";

import { useState } from "react";

export default function PostPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Köszönjük!</h1>
        <p>A hirdetésed jóváhagyás után megjelenik.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hirdetés feladása</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-3"
      >
        <input type="text" placeholder="Cím" className="border w-full p-2 rounded" required />

        <select className="border w-full p-2 rounded" required>
          <option value="">Kategória</option>
          <option value="Autó">Autó</option>
          <option value="Motor">Motor</option>
          <option value="Alkatrész">Alkatrész</option>
        </select>

        <input type="number" placeholder="Ár (Ft)" className="border w-full p-2 rounded" required />

        <input type="text" placeholder="Település" className="border w-full p-2 rounded" required />

        <textarea placeholder="Leírás" className="border w-full p-2 rounded h-24"></textarea>

        <div className="border border-dashed p-4 rounded text-center text-gray-500">Képfeltöltés (drag &amp; drop)</div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Beküldés jóváhagyásra
        </button>
      </form>
    </div>
  );
}
