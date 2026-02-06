import Link from "next/link";

import { APP } from "@/lib/config";

export default function Page() {
  return (
    <section className="flex flex-col items-center justify-center text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
          {APP.name} – Jármű hirdetések {APP.region}
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Modern, gyors, mobilbarát – és átláthatóbb felület, olcsóbb kiemelésekkel.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/browse"
          className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition-colors"
        >
          Böngészés
        </Link>
        <Link
          href="/post"
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded shadow hover:bg-gray-300 transition-colors"
        >
          Hirdetés feladás
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-4xl">
        <div className="p-4 bg-white rounded shadow text-left">
          <h3 className="font-semibold text-gray-900 mb-2">Gyors értesítések</h3>
          <p className="text-sm text-gray-700">
            Web Push és e-mail értesítések, hogy azonnal értesülj a friss hirdetésekről.
          </p>
        </div>
        <div className="p-4 bg-white rounded shadow text-left">
          <h3 className="font-semibold text-gray-900 mb-2">Jóváhagyott hirdetések</h3>
          <p className="text-sm text-gray-700">
            Minden hirdetést admin jóváhagyása előz meg, így kevesebb a spam.
          </p>
        </div>
        <div className="p-4 bg-white rounded shadow text-left">
          <h3 className="font-semibold text-gray-900 mb-2">Helyi fókusz</h3>
          <p className="text-sm text-gray-700">
            {APP.region} fókuszú hirdetések – több releváns ajánlat, kevesebb zaj.
          </p>
        </div>
        <div className="p-4 bg-white rounded shadow text-left">
          <h3 className="font-semibold text-gray-900 mb-2">Átláthatóbb, modernebb UI</h3>
          <p className="text-sm text-gray-700">
            Egyszerű kezelhetőség és kedvező kiemelési csomagok az induláskor.
          </p>
        </div>
      </div>
    </section>
  );
}
