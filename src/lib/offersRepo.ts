import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export type CreateOfferInput = {
  listingId: string;
  offerPrice: number;
  message?: string;
};

export async function createOffer(input: CreateOfferInput) {
  if (!isSupabaseConfigured) throw new Error("A funkció jelenleg nem elérhető.");

  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData.session?.user?.id;
  if (!uid) throw new Error("Not authenticated");

  const payload: any = {
    listing_id: input.listingId,
    buyer_id: uid,
    offer_price: input.offerPrice,
    message: input.message?.trim() ? input.message.trim() : null,
    status: "pending",
  };

  const { error } = await supabase.from("offers").insert(payload);

  if (error) {
    // unique(listing_id,buyer_id)
    if ((error as any).code === "23505") {
      throw new Error("Erre a hirdetésre már tettél ajánlatot.");
    }
    throw new Error(error.message);
  }

  return { ok: true as const };
}
