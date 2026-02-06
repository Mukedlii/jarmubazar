export interface Listing {
  id: number;
  title: string;
  category: "Autó" | "Motor" | "Alkatrész";
  price: number;
  location: string;
  posted: string;
  featured?: boolean;
  description?: string;
}

export const listings: Listing[] = [
  {
    id: 1,
    title: "Opel Astra 1.6",
    category: "Autó",
    price: 1250000,
    location: "Tatabánya",
    posted: "2 órája",
    featured: true,
    description: "Jó állapotú, rendszeresen karbantartott.",
  },
  {
    id: 2,
    title: "Suzuki Swift 1.3 GS",
    category: "Autó",
    price: 890000,
    location: "Esztergom",
    posted: "1 napja",
    description: "Kisebb esztétikai hibákkal, friss vizsga.",
  },
  {
    id: 3,
    title: "Yamaha MT-07",
    category: "Motor",
    price: 2400000,
    location: "Komárom",
    posted: "4 napja",
    featured: true,
    description: "Sportos, keveset futott, első tulajdonostól.",
  },
  {
    id: 4,
    title: "Honda Civic 1.8 Sport",
    category: "Autó",
    price: 1950000,
    location: "Dorog",
    posted: "3 napja",
    description: "Megbízható családi autó, garázsban tartott.",
  },
  {
    id: 5,
    title: "Motorkerékpár sisak",
    category: "Alkatrész",
    price: 25000,
    location: "Oroszlány",
    posted: "5 napja",
  },
  {
    id: 6,
    title: "Volkswagen Golf IV",
    category: "Autó",
    price: 800000,
    location: "Tatabánya",
    posted: "2 hete",
    description: "Kedvező fogyasztás, klíma működik.",
  },
  {
    id: 7,
    title: "BMW F 650 GS",
    category: "Motor",
    price: 1500000,
    location: "Kisbér",
    posted: "1 hete",
    description: "Terepre is alkalmas, extrákkal.",
  },
  {
    id: 8,
    title: "Toyota Auris HSD",
    category: "Autó",
    price: 2800000,
    location: "Esztergom",
    posted: "6 napja",
    featured: true,
    description: "Hibrid, alacsony fenntartási költség.",
  },
  {
    id: 9,
    title: "Motor blokk 125 ccm",
    category: "Alkatrész",
    price: 80000,
    location: "Komárom",
    posted: "3 napja",
  },
  {
    id: 10,
    title: "Audi A4 Avant 2.0TDI",
    category: "Autó",
    price: 3200000,
    location: "Tatabánya",
    posted: "2 hete",
    description: "Nagyon jó állapot, rendszeresen szervizelve.",
  },
];
