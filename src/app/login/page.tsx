"use client";

import { useState } from "react";

export default function Page() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Magic link belépés</h1>
      {sent ? (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
          <p>Küldtünk egy belépő linket az emailedre.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">E-mail cím</label>
            <input type="email" required className="border rounded px-3 py-2" />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors w-full"
          >
            Belépő link küldése
          </button>
        </form>
      )}
    </div>
  );
}
