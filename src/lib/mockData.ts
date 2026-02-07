export type Fuel = "Benzin" | "Dízel" | "Hibrid" | "Elektromos" | "LPG" | "CNG";
export type Transmission = "Manuális" | "Automata";
export type BodyType =
  | "Sedan"
  | "Kombi"
  | "Ferdehátú"
  | "SUV"
  | "Coupé"
  | "Egyterű"
  | "Pickup"
  | "Kisbusz"
  | "Cabrio";

export interface Listing {
  id: number;
  title: string;
  category: "Autó" | "Motor" | "Alkatrész";
  price: number;
  location: string;
  posted: string;
  featured?: boolean;
  description?: string;

  // Autó specifikus (MVP bővítés)
  brand?: string;
  model?: string;
  year?: number;
  km?: number;
  fuel?: Fuel;
  transmission?: Transmission;
  bodyType?: BodyType;
  hungarianPlates?: boolean; // magyar forgalomban
}

export const CAR_BRANDS: string[] = [
  "Abarth",
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Bugatti",
  "BYD",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Cupra",
  "Dacia",
  "Daewoo",
  "Daihatsu",
  "Dodge",
  "DS",
  "Ferrari",
  "Fiat",
  "Ford",
  "Geely",
  "Genesis",
  "GMC",
  "Great Wall",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Isuzu",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lada",
  "Lamborghini",
  "Lancia",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "MG",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Opel",
  "Peugeot",
  "Polestar",
  "Porsche",
  "Renault",
  "Rolls-Royce",
  "Saab",
  "Seat",
  "Skoda",
  "Smart",
  "SsangYong",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

export const listings: Listing[] = [
  {
    id: 1,
    title: "Opel Astra 1.6",
    category: "Autó",
    brand: "Opel",
    model: "Astra",
    year: 2009,
    km: 198000,
    fuel: "Benzin",
    transmission: "Manuális",
    bodyType: "Ferdehátú",
    hungarianPlates: true,
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
    brand: "Suzuki",
    model: "Swift",
    year: 2007,
    km: 176000,
    fuel: "Benzin",
    transmission: "Manuális",
    bodyType: "Ferdehátú",
    hungarianPlates: true,
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
    brand: "Honda",
    model: "Civic",
    year: 2008,
    km: 212000,
    fuel: "Benzin",
    transmission: "Manuális",
    bodyType: "Ferdehátú",
    hungarianPlates: true,
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
    brand: "Volkswagen",
    model: "Golf",
    year: 2002,
    km: 265000,
    fuel: "Dízel",
    transmission: "Manuális",
    bodyType: "Ferdehátú",
    hungarianPlates: true,
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
    brand: "Toyota",
    model: "Auris",
    year: 2012,
    km: 154000,
    fuel: "Hibrid",
    transmission: "Automata",
    bodyType: "Ferdehátú",
    hungarianPlates: true,
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
    title: "Audi A4 Avant 2.0 TDI",
    category: "Autó",
    brand: "Audi",
    model: "A4",
    year: 2011,
    km: 238000,
    fuel: "Dízel",
    transmission: "Manuális",
    bodyType: "Kombi",
    hungarianPlates: false,
    price: 3200000,
    location: "Tatabánya",
    posted: "2 hete",
    description: "Nagyon jó állapot, rendszeresen szervizelve.",
  },
];
