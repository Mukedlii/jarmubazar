import Image from "next/image";

import { listings } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

const GALLERY = ["/assets/car1.png", "/assets/car2.png", "/assets/car3.png"];

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

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="lg:w-2/3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
              <Image src={GALLERY[0]} alt={listing.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {GALLERY.slice(0, 3).map((src) => (
                <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                  <Image src={src} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{listing.title}</h1>
              {listing.featured && (
                <div className="rounded-full bg-yellow-300/90 px-3 py-1 text-xs font-semibold text-slate-900">
                  Kiemelt
                </div>
              )}
            </div>

            <div className="mt-3 text-3xl font-bold text-blue-700">{formatPrice(listing.price)}</div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">{listing.category}</span>
              <span className="text-slate-500">•</span>
              <span>{listing.location}</span>
              <span className="text-slate-500">•</span>
              <span>{listing.posted}</span>
            </div>

            <div className="mt-6 space-y-2">
              <button
                disabled
                title="MVP-ben később"
                className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500"
              >
                Üzenet küldése
              </button>
              <button
                disabled
                title="MVP-ben később"
                className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500"
              >
                Telefon megjelenítése
              </button>
              <button className="w-full rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100">
                Jelentés
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold text-slate-900">Leírás</h2>
          <p className="mt-2 text-slate-700">{listing.description ?? "Leírás hamarosan..."}</p>
        </div>
      </div>
    </div>
  );
}
