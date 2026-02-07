import type { Listing } from "@/lib/mockData";
import { listings as mockListings } from "@/lib/mockData";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export type ListingStatus = "pending" | "approved" | "rejected";

export type CreateListingInput = {
  category: Listing["category"];
  title: string;
  description?: string;
  price: number;
  location: string;
  // car
  brand?: string;
  model?: string;
  year?: number;
  km?: number;
  fuel?: string;
  transmission?: string;
  bodyType?: string;
  hungarianPlates?: boolean;
};

/**
 * Phase 1 repo.
 * - If Supabase env vars are missing, we fallback to mock data.
 * - Once Supabase is configured, these functions should be updated to query DB.
 */
export async function listApprovedListings(): Promise<Listing[]> {
  if (!isSupabaseConfigured) return mockListings.filter((l) => (l as any).status !== "pending");

  // TODO (after schema): select from public.listings where status='approved'
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as any) ?? [];
}

export async function getListingById(id: string | number): Promise<Listing | null> {
  if (!isSupabaseConfigured) {
    const n = typeof id === "string" ? parseInt(id) : id;
    return mockListings.find((l) => l.id === n) ?? null;
  }

  const { data, error } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as any) ?? null;
}

export async function createListing(input: CreateListingInput) {
  if (!isSupabaseConfigured) {
    // Demo-only: do nothing
    return { ok: true as const, id: "demo" };
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData.session?.user?.id;
  if (!uid) throw new Error("Not authenticated");

  const payload: any = {
    owner_id: uid,
    status: "pending",
    category: input.category,
    title: input.title,
    description: input.description ?? null,
    price: input.price,
    location: input.location,
    brand: input.brand ?? null,
    model: input.model ?? null,
    year: input.year ?? null,
    km: input.km ?? null,
    fuel: input.fuel ?? null,
    transmission: input.transmission ?? null,
    body_type: input.bodyType ?? null,
    hungarian_plates: input.hungarianPlates ?? null,
  };

  const { data, error } = await supabase.from("listings").insert(payload).select("id").single();
  if (error) throw new Error(error.message);

  return { ok: true as const, id: (data as any).id as string };
}
