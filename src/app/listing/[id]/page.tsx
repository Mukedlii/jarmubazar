import Image from "next/image";

import { listings } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

const GALLERY = ["/assets/car1.png", "/assets/car2.png", "/assets/car3.png"];

function fmtKm(km?: number) {
  if (km == null) return "–";
  return `${km.toLocaleString("hu-HU")} km`;
}

export default async function ListingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listingId = parseInt(id);
  const listing = listings.find((l) => l.id === listingId);

  if (!listing) {
    return <div className="rounded-2xl border bg-white p-6 text-slate-700">A hirdetés nem található.</div>;
  }

  const attrs = [
    listing.brand ? ["Márka", listing.brand] : null,
    listing.model ? ["Típus", listing.model] : null,
    listing.year ? ["Évjárat", String(listing.year)] : null,
    listing.km != null ? ["Km óra", fmtKm(listing.km)] : null,
    listing.fuel ? ["Üzemanyag", listing.fuel] : null,
    listing.transmission ? ["Váltó", listing.transmission] : null,
    listing.bodyType ? ["Karosszéria", listing.bodyType] : null,
    listing.hungarianPlates != null
      ? ["Magyar forgalomban", listing.hungarianPlates ? "Igen" : "Nem"]
      : null,
    ["Település", listing.location],
    ["Hirdetve", listing.posted],
  ].filter(Boolean) as Array<[string, string]>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="lg:w-2/3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900">
              <Image src={GALLERY[0]} alt={listing.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {GALLERY.slice(0, 3).map((src) => (
                <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
                  <Image src={src} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{listing.title}</h1>
              {listing.featured && (
                <div className="rounded-full bg-yellow-300/90 px-3 py-1 text-xs font-semibold text-slate-900">
                  Kiemelt
                </div>
              )}
            </div>

            <div className="mt-3 text-3xl font-bold text-blue-700">{formatPrice(listing.price)}</div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/30">
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {attrs.map(([k, v]) => (
                  <div key={k} className="col-span-2 grid grid-cols-2 gap-x-3">
                    <div className="text-slate-500 dark:text-slate-400">{k}</div>
                    <div className="text-slate-900 dark:text-slate-100">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button
                disabled
                title="MVP-ben később"
                className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500 dark:bg-slate-900/40 dark:text-slate-400"
              >
                Üzenet küldése
              </button>
              <button
                disabled
                title="MVP-ben később"
                className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500 dark:bg-slate-900/40 dark:text-slate-400"
              >
                Telefon megjelenítése
              </button>
              <button className="w-full rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-200 dark:hover:bg-red-900/20">
                Jelentés
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Leírás</h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{listing.description ?? "Leírás hamarosan..."}</p>
        </div>
      </div>
    </div>
  );
}
