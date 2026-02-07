import Image from "next/image";
import Link from "next/link";

import { APP } from "@/lib/config";

export default function Page() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border bg-slate-950 text-white">
        <Image
          src="/assets/hero-bg.png"
          alt="Hero"
          fill
          priority
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950" />

        <div className="relative px-6 py-14 sm:px-10 sm:py-16">
          <div className="max-w-2xl">
            <p className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              Komárom-Esztergom megye • MVP
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {APP.name}
              <span className="block text-white/90">Jármű hirdetések, modern felületen.</span>
            </h1>
            <p className="mt-4 text-base text-white/80 sm:text-lg">
              Modern, gyors, mobilbarát – átláthatóbb felület és kedvező kiemelési csomagok.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/browse"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Böngészés
              </Link>
              <Link
                href="/post"
                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
              >
                Hirdetés feladás
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {[
                {
                  t: "Gyors értesítések",
                  d: "Web Push + e-mail értesítések, hogy azonnal lásd az új hirdetéseket.",
                },
                {
                  t: "Jóváhagyott hirdetések",
                  d: "Admin jóváhagyás → kevesebb spam, jobb minőség.",
                },
                {
                  t: "Helyi fókusz",
                  d: `${APP.region} – több releváns ajánlat, kevesebb zaj.`,
                },
                {
                  t: "Egyszerű kiemelés",
                  d: "Átlátható csomagok (MVP után): gyorsabb eladás, jobb láthatóság.",
                },
              ].map((x) => (
                <div
                  key={x.t}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <div className="text-sm font-semibold">{x.t}</div>
                  <div className="mt-1 text-sm text-white/75">{x.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="grid gap-4 rounded-3xl border bg-white p-6 sm:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Ne maradj le a jó vételekről.</h2>
          <p className="mt-2 text-slate-600">
            Mentett keresések + értesítések (hamarosan). Addig is: böngéssz, vagy adj fel hirdetést.
          </p>
        </div>
        <div className="flex items-center justify-start gap-3 sm:justify-end">
          <Link
            href="/browse"
            className="rounded-xl border px-4 py-2 font-semibold text-slate-900 hover:bg-slate-50"
          >
            Böngészés
          </Link>
          <Link
            href="/login"
            className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
          >
            Bejelentkezés
          </Link>
        </div>
      </section>
    </div>
  );
}
