"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { getListingById } from "@/lib/listingsRepo";
import { createOffer } from "@/lib/offersRepo";
import { formatPrice } from "@/lib/utils";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

const GALLERY = ["/assets/car1.png", "/assets/car2.png", "/assets/car3.png"];

function fmtKm(km?: number) {
  if (km == null) return "–";
  return `${km.toLocaleString("hu-HU")} km`;
}

export default function ListingDetail({ params }: { params: { id: string } }) {
  const id = params.id;

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMsg, setOfferMsg] = useState("");
  const [offerSent, setOfferSent] = useState(false);
  const [offerError, setOfferError] = useState<string>("");

  const [authed, setAuthed] = useState<boolean>(false);

  useEffect(() => {
    let alive = true;

    setLoading(true);
    getListingById(id)
      .then((x) => {
        if (!alive) return;
        setListing(x);
      })
      .catch(() => {
        if (!alive) return;
        setListing(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data }) => {
        if (!alive) return;
        setAuthed(Boolean(data.session));
      });
    }

    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return <div className="rounded-2xl border bg-white p-6 text-slate-700">Betöltés…</div>;
  }

  if (!listing) {
    return <div className="rounded-2xl border bg-white p-6 text-slate-700">A hirdetés nem található.</div>;
  }

  const attrs = useMemo(() => {
    const body = listing.body_type ?? listing.bodyType;
    const hp = listing.hungarian_plates ?? listing.hungarianPlates;
    const posted = listing.posted ?? (listing.created_at ? new Date(listing.created_at).toLocaleDateString("hu-HU") : "–");

    return [
      listing.brand ? ["Márka", listing.brand] : null,
      listing.model ? ["Típus", listing.model] : null,
      listing.year ? ["Évjárat", String(listing.year)] : null,
      listing.km != null ? ["Km óra", fmtKm(listing.km)] : null,
      listing.fuel ? ["Üzemanyag", listing.fuel] : null,
      listing.transmission ? ["Váltó", listing.transmission] : null,
      body ? ["Karosszéria", String(body)] : null,
      hp != null ? ["Magyar forgalomban", hp ? "Igen" : "Nem"] : null,
      ["Település", listing.location],
      ["Hirdetve", posted],
    ].filter(Boolean) as Array<[string, string]>;
  }, [listing]);

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

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/30">
                <div className="font-semibold text-slate-900 dark:text-slate-100">Ajánlat tétel</div>
                <div className="mt-1 text-slate-600 dark:text-slate-400">Privát ajánlat, csak bejelentkezve.</div>

                {!isSupabaseConfigured ? (
                  <div className="mt-2 text-slate-500 dark:text-slate-400">A funkció jelenleg nem elérhető.</div>
                ) : !authed ? (
                  <a
                    href="/login"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
                  >
                    Bejelentkezés az ajánlattételhez
                  </a>
                ) : offerSent ? (
                  <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-200">
                    Ajánlat elküldve.
                  </div>
                ) : (
                  <form
                    className="mt-3 space-y-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setOfferError("");

                      const p = parseInt(offerPrice);
                      if (!Number.isFinite(p) || p <= 0) {
                        setOfferError("Adj meg érvényes összeget.");
                        return;
                      }

                      try {
                        await createOffer({
                          listingId: String(listing.id),
                          offerPrice: p,
                          message: offerMsg,
                        });
                        setOfferSent(true);
                      } catch (err: any) {
                        setOfferError(err?.message ?? "Sikertelen ajánlattétel.");
                      }
                    }}
                  >
                    {offerError && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-red-900 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-200">
                        {offerError}
                      </div>
                    )}

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Ajánlati ár (Ft)</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Üzenet (opcionális)</label>
                      <textarea
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                        rows={3}
                        value={offerMsg}
                        onChange={(e) => setOfferMsg(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500"
                    >
                      Ajánlat elküldése
                    </button>
                  </form>
                )}
              </div>

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
