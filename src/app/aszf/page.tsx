export default function AszfPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Általános Szerződési Feltételek (ÁSZF)</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Minta / placeholder. Éles indulás előtt jogi szöveg szükséges.
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">1. Szolgáltatás</h2>
        <p className="text-slate-700 dark:text-slate-300">
          A weboldal járműhirdetések megjelenítésére és beküldésére szolgál. A hirdetések tartalmáért a hirdető felel.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">2. Hirdetések</h2>
        <p className="text-slate-700 dark:text-slate-300">
          A beküldött hirdetések moderálás után kerülhetnek publikálásra. A szolgáltató fenntartja a jogot a hirdetések
          visszautasítására.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">3. Felelősség</h2>
        <p className="text-slate-700 dark:text-slate-300">
          A szolgáltató nem vállal felelősséget a hirdetésekben szereplő adatok pontosságáért, illetve a hirdetők és
          felhasználók közötti ügyletekért.
        </p>
      </section>

      <p className="text-xs text-slate-500 dark:text-slate-500">Utolsó frissítés: 2026-02-07</p>
    </div>
  );
}
