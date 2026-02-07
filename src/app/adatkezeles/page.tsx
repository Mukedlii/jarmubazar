export default function AdatkezelesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Adatkezelési tájékoztató</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Minta / placeholder. Éles indulás előtt pontos adatkezelési tájékoztató szükséges.
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Milyen adatokat kezelünk?</h2>
        <ul className="list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
          <li>Belépéshez megadott e-mail cím (magic link)</li>
          <li>Hirdetés adatai (cím, ár, leírás, jármű paraméterek, település)</li>
          <li>Technikai adatok (naplózás, biztonság)</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Miért?</h2>
        <p className="text-slate-700 dark:text-slate-300">
          A szolgáltatás működtetéséhez, a hirdetések megjelenítéséhez, valamint biztonsági és visszaélés-megelőzési
          célból.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Adatmegőrzés</h2>
        <p className="text-slate-700 dark:text-slate-300">
          A megőrzési idő a szolgáltatás jellegétől függ. Éles indulásnál ezt pontosítjuk.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Jogok</h2>
        <p className="text-slate-700 dark:text-slate-300">
          Hozzáférés, helyesbítés, törlés, tiltakozás — a vonatkozó jogszabályok szerint.
        </p>
      </section>

      <p className="text-xs text-slate-500 dark:text-slate-500">Utolsó frissítés: 2026-02-07</p>
    </div>
  );
}
