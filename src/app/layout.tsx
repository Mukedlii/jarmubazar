import "./globals.css";

import Link from "next/link";
import type { ReactNode } from "react";

import { APP } from "@/lib/config";

export const metadata = {
  title: APP.name,
  description: `Jármű hirdetések – ${APP.region}.`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="hu">
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-50 bg-white shadow">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-bold text-blue-600">
              {APP.name}
            </Link>
            <div className="flex space-x-4 text-sm">
              <Link href="/browse" className="text-gray-700 hover:text-blue-600 transition-colors">
                Böngészés
              </Link>
              <Link href="/post" className="text-gray-700 hover:text-blue-600 transition-colors">
                Hirdetés feladás
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                Bejelentkezés
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

        <footer className="bg-gray-100 text-gray-600 py-4 mt-8">
          <div className="mx-auto max-w-5xl px-4 text-center text-sm">
            Kapcsolat:{" "}
            <a href={`mailto:${APP.adminEmail}`} className="underline hover:text-blue-600">
              {APP.adminEmail}
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
