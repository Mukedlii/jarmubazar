import Image from "next/image";
import Link from "next/link";

import { APP } from "@/lib/config";

function Icon({ name }: { name: "bolt" | "shield" | "pin" | "spark" }) {
  const common = {
    className: "h-4 w-4",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 2,
    stroke: "currentColor",
  } as const;

  if (name === "bolt")
    return (
      <svg {...common}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 3 14h7l-1 8 12-14h-7l-1-6z" />
      </svg>
    );
  if (name === "shield")
    return (
      <svg {...common}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 2 20 6v6c0 5-3.6 9.4-8 10-4.4-.6-8-5-8-10V6l8-4z"
        />
      </svg>
    );
  if (name === "pin")
    return (
      <svg {...common}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
      </svg>
    );
  return (
    <svg {...common}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l1.2 3.7L17 8l-3.8 1.3L12 13l-1.2-3.7L7 8l3.8-1.3L12 3z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 14l.8 2.4L8 17l-2.2.6L5 20l-.8-2.4L2 17l2.2-.6L5 14z"
      />
    </svg>
  );
}

export default function Page() {
  const features = [
    {
      icon: "bolt" as const,
      t: "Gyors keresés",
      d: "Pár szűrő, és már látod is a releváns találatokat — mobilon is kényelmes.",
    },
    {
      icon: "shield" as const,
      t: "Kevesebb spam",
      d: "Jóváhagyásos rendszerrel tisztább és áttekinthetőbb a kínálat.",
    },
    {
      icon: "pin" as const,
      t: "Helyi fókusz",
      d: `${APP.region} környéke — nem kell végiggörgetned fél Magyarországot.`,
    },
    {
      icon: "spark" as const,
      t: "Profi felület",
      d: "Letisztult, átlátható felület — gyors böngészés és gyors kapcsolatfelvétel.",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-950 text-white shadow-sm dark:border-slate-800">
        <Image
          src="/assets/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950" />

        <div className="relative px-6 py-14 sm:px-10 sm:py-16">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Helyi hirdetések • Gyors jóváhagyás
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {APP.name}
              <span className="block text-white/90">Helyi járműhirdetések {APP.region} környékén.</span>
            </h1>

            <p className="mt-4 text-base text-white/80 sm:text-lg">
              Helyi fókusz, letisztult szűrők, jóváhagyásos megjelenés — hogy a komoly hirdetések gyorsabban célba érjenek.
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
              {features.map((x) => (
                <div
                  key={x.t}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                      <Icon name={x.icon} />
                    </span>
                    {x.t}
                  </div>
                  <div className="mt-2 text-sm text-white/75">{x.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Secondary */}
      <section className="grid gap-4 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Készen állsz a böngészésre?</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Szűrd márkára, típusra, évjáratra, futásteljesítményre — és találd meg a jó vételt.
          </p>
        </div>
        <div className="flex items-center justify-start gap-3 sm:justify-end">
          <Link
            href="/browse"
            className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-900"
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
