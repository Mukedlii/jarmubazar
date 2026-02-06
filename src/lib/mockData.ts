export type Listing = {
  id: string;
  title: string;
  price: number;
  location: string;
  time: string;
  category: "Autó" | "Motor" | "Alkatrész";
  featured?: boolean;
};

/**
 * Tömbbe rendezett mock hirdetések, amelyek csak a UI megjelenítésére szolgálnak.
 */
export const mockData: Listing[] = [
  {
    id: "1",
    title: "Opel Astra 1.6",
    price: 1250000,
    location: "Tatabánya",
    time: "2 órája",
    category: "Autó",
    featured: true,
  },
  {
    id: "2",
    title: "Suzuki GSX-R 750",
    price: 1800000,
    location: "Esztergom",
    time: "5 órája",
    category: "Motor",
  },
  {
    id: "3",
    title: "VW Passat B6",
    price: 2200000,
    location: "Komárom",
    time: "1 napja",
    category: "Autó",
  },
  {
    id: "4",
    title: "Audi A4 2.0 TDI",
    price: 3200000,
    location: "Oroszlány",
    time: "3 napja",
    category: "Autó",
    featured: true,
  },
  {
    id: "5",
    title: "Motor blokk Honda CBR",
    price: 350000,
    location: "Dorog",
    time: "7 órája",
    category: "Alkatrész",
  },
  {
    id: "6",
    title: "Skoda Octavia 1.9 TDI",
    price: 1500000,
    location: "Tatabánya",
    time: "2 napja",
    category: "Autó",
  },
  {
    id: "7",
    title: "Yamaha MT-07",
    price: 2100000,
    location: "Esztergom",
    time: "4 napja",
    category: "Motor",
    featured: true,
  },
  {
    id: "8",
    title: "BMW E46 330i",
    price: 2800000,
    location: "Komárom",
    time: "6 napja",
    category: "Autó",
  },
  {
    id: "9",
    title: "Alufelni szett 17\"",
    price: 120000,
    location: "Tatabánya",
    time: "3 órája",
    category: "Alkatrész",
  },
  {
    id: "10",
    title: "Ford Focus 1.8",
    price: 800000,
    location: "Oroszlány",
    time: "5 napja",
    category: "Autó",
  },
];
