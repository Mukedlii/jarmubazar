import { listings } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

export default async function ListingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listingId = parseInt(id);
  const listing = listings.find((l) => l.id === listingId);

  if (!listing) {
    return <div className="p-4">A hirdetés nem található.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="h-56 bg-gray-200 flex items-center justify-center mb-2">Főkép</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-20 bg-gray-200"></div>
            <div className="h-20 bg-gray-200"></div>
            <div className="h-20 bg-gray-200"></div>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-bold">{listing.title}</h1>
          <p className="text-blue-600 text-lg font-semibold">{formatPrice(listing.price)}</p>
          <p>
            {listing.location} • {listing.posted}
          </p>
          <p>Kategória: {listing.category}</p>
          <p className="mt-4">{listing.description ?? "Leírás hamarosan..."}</p>

          <div className="mt-6 space-x-2">
            <button
              disabled
              title="MVP-ben később"
              className="bg-gray-300 text-gray-500 px-4 py-2 rounded"
            >
              Üzenet küldése
            </button>
            <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded">
              Telefon megjelenítése
            </button>
            <button className="bg-red-100 text-red-600 px-4 py-2 rounded">Jelentés</button>
          </div>
        </div>
      </div>
    </div>
  );
}
