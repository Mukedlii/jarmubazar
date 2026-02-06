import Link from "next/link";

import { mockData } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

export default function Page() {
  return (
    <div className="space-y-6">
      <section className="bg-white p-4 rounded shadow space-y-4">
        <h1 className="text-xl font-semibold text-gray-900">Szűrés</h1>
        <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">Kategória</label>
            <select className="border rounded px-3 py-2">
              <option value="">Mindegy</option>
              <option value="Autó">Autó</option>
              <option value="Motor">Motor</option>
              <option value="Alkatrész">Alkatrész</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">Ár min (Ft)</label>
            <input type="number" className="border rounded px-3 py-2" placeholder="0" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">Ár max (Ft)</label>
            <input type="number" className="border rounded px-3 py-2" placeholder="10 000 000" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">Település</label>
            <input type="text" className="border rounded px-3 py-2" placeholder="pl. Tatabánya" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">Rendezés</label>
            <select className="border rounded px-3 py-2">
              <option value="legujabb">Legújabb</option>
              <option value="ar-novekvo">Ár szerint növekvő</option>
              <option value="ar-csokkeno">Ár szerint csökkenő</option>
            </select>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Találatok</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockData.map((item) => (
            <Link
              key={item.id}
              href={`/listing/${item.id}`}
              className="block bg-white rounded shadow hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-gray-200 rounded-t" />
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  {item.featured && (
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Kiemelt</span>
                  )}
                </div>
                <p className="text-blue-600 font-bold">{formatPrice(item.price)}</p>
                <p className="text-sm text-gray-700">{item.location}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
