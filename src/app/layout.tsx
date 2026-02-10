import "./globals.css";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import AuthLinks from "@/components/AuthLinks";
import { APP } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(APP.siteUrl),
  title: {
    default: `${APP.name} – Autóhirdetések`,
    template: `%s • ${APP.name}`,
  },
  description: `Autó- és járműhirdetések – ${APP.region}.`,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: "/",
    title: `${APP.name} – Autóhirdetések`,
    description: `Autó- és járműhirdetések – ${APP.region}.`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP.name} – Autóhirdetések`,
    description: `Autó- és járműhirdetések – ${APP.region}.`,
  },
};

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="hu">
      <body className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
          <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.svg" alt={`${APP.name} logo`} width={28} height={28} priority />
              <div className="leading-tight">
                <div className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {APP.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{APP.region}</div>
              </div>
            </Link>

            <div className="hidden items-center gap-1 sm:flex">
              <NavLink href="/browse">Böngészés</NavLink>
              <NavLink href="/post">Hirdetés feladás</NavLink>
              <NavLink href="/alerts">Értesítések</NavLink>
              <AuthLinks />
              <NavLink href="/contact">Kapcsolat</NavLink>
            </div>

            <div className="flex items-center gap-2 sm:hidden">
              <Link
                href="/browse"
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Böngészés
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

        <footer className="mt-10 border-t border-slate-200/70 bg-white/60 py-6 text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="flex items-center gap-2">
                <Image src="/logo.svg" alt="" width={18} height={18} />
                <div className="text-sm">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{APP.name}</span>
                  <span className="ml-2 text-slate-500 dark:text-slate-500">© {new Date().getFullYear()}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                <Link href="/contact" className="underline hover:text-blue-600">
                  Kapcsolat
                </Link>
                <Link href="/aszf" className="underline hover:text-blue-600">
                  ÁSZF
                </Link>
                <Link href="/adatkezeles" className="underline hover:text-blue-600">
                  Adatkezelés
                </Link>
                <Link href="/impresszum" className="underline hover:text-blue-600">
                  Impresszum
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
