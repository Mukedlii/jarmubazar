import { mockData } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

export default function Page({ params }: { params: { id: string } }) {
  const item = mockData.find((x) => x.id === params.id) ?? mockData[0];
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
        <span className="text-2xl text-blue-600 font-bold">{formatPrice(item.price)}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 space-y-4">
          <div className="h-64 bg-gray-200 rounded" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-16 bg-gray-200 rounded" />
            <div className="h-16 bg-gray-200 rounded" />
            <div className="h-16 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="md:w-1/3 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Főbb adatok</h2>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>
              <span className="font-medium">Település:</span> {item.location}
            </li>
            <li>
              <span className="font-medium">Kategória:</span> {item.category}
            </li>
            <li>
              <span className="font-medium">Feltöltve:</span> {item.time}
            </li>
          </ul>

          <div className="space-y-2">
            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
              title="MVP-ben később"
            >
              Üzenet küldése
            </button>
            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
              title="MVP-ben később"
            >
              Telefon megjelenítése
            </button>
            <button className="w-full bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 transition-colors">
              Report
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Leírás</h2>
        <p className="text-sm text-gray-700">
          Részletes leírás a járműről. Ez a szöveg csak minta, a valódi hirdetésnél a felhasználó által megadott leírás
          jelenik meg.
        </p>
      </div>
    </div>
  );
}
