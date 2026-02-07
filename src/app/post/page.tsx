"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500";

export default function PostPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Köszönjük!</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">A hirdetésed jóváhagyás után megjelenik.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Hirdetés feladása</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">MVP: a beküldés most csak demo, mentés később jön.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="mt-5 space-y-3"
      >
        <input type="text" placeholder="Cím" className={inputClass} required />

        {/* Fix: select text/option contrast dark mode-ban */}
        <select className={inputClass} defaultValue="" required>
          <option value="">Kategória</option>
          <option value="Autó">Autó</option>
          <option value="Motor">Motor</option>
          <option value="Alkatrész">Alkatrész</option>
        </select>

        <input type="number" placeholder="Ár (Ft)" className={inputClass} required />

        <input type="text" placeholder="Település" className={inputClass} required />

        <textarea placeholder="Leírás" className={`${inputClass} h-28 resize-none`} />

        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300">
          Képfeltöltés (drag &amp; drop) — MVP-ben később
        </div>

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
