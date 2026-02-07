import { APP } from "@/lib/config";

export default function ImpresszumPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Impresszum</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Minta / placeholder. Éles indulás előtt a szolgáltató adatait kötelezően ki kell tölteni.
        </p>
      </div>

      <div className="rounded-2xl border bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/30">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <div className="text-slate-500 dark:text-slate-400">Oldal neve</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">{APP.name}</div>
          </div>
          <div>
            <div className="text-slate-500 dark:text-slate-400">Terület</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">{APP.region}</div>
          </div>
          <div className="sm:col-span-2">
            <div className="text-slate-500 dark:text-slate-400">Kapcsolat</div>
            <div className="font-mono text-slate-900 dark:text-slate-100">A kapcsolat oldalon (spam ellen védve).</div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-500">Utolsó frissítés: 2026-02-07</p>
    </div>
  );
}
