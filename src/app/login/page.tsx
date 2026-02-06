"use client";

import { useState } from "react";

export default function LoginPage() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Köszi!</h1>
        <p>Küldtünk egy belépő linket az emailedre.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bejelentkezés</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="space-y-3"
      >
        <input type="email" placeholder="Email" className="border w-full p-2 rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Belépő link küldése
        </button>
      </form>
    </div>
  );
}
