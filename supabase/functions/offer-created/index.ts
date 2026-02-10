// Supabase Edge Function: offer-created
// Triggered by Postgres (pg_net) on new offer insert.
// Forwards to:
// - generic WEBHOOK_URL (required)
// - Telegram (optional)
// - Email via Resend (optional)

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type Payload = {
  offer_id: string;
  listing_id: string;
  buyer_id: string;
  offer_price: number;
  message: string | null;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

serve(async (req) => {
  try {
    if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

    const secret = Deno.env.get("DB_WEBHOOK_SECRET") ?? "";
    if (secret) {
      const got = req.headers.get("authorization") ?? "";
      if (got !== `Bearer ${secret}`) return json({ error: "unauthorized" }, 401);
    }

    const payload = (await req.json()) as Payload;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // Get offer + listing + seller
    const { data: offer, error: offerErr } = await supabaseAdmin
      .from("offers")
      .select("id, created_at, offer_price, message, status, listing_id, buyer_id")
      .eq("id", payload.offer_id)
      .maybeSingle();

    if (offerErr) throw new Error(offerErr.message);
    if (!offer) throw new Error("Offer not found");

    const { data: listing, error: listingErr } = await supabaseAdmin
      .from("listings")
      .select("id, title, price, owner_id")
      .eq("id", offer.listing_id)
      .maybeSingle();

    if (listingErr) throw new Error(listingErr.message);
    if (!listing) throw new Error("Listing not found");

    const { data: sellerUser, error: sellerErr } = await supabaseAdmin.auth.admin.getUserById(listing.owner_id);
    if (sellerErr) throw new Error(sellerErr.message);

    const sellerEmail = sellerUser.user?.email ?? null;

    const msgText = [
      "Új ajánlat érkezett",
      `Hirdetés: ${listing.title}`,
      `Ajánlat: ${offer.offer_price} Ft",
      offer.message ? `Üzenet: ${offer.message}` : null,
      `Link: ${Deno.env.get("PUBLIC_SITE_URL") ?? ""}/offers`,
    ]
      .filter(Boolean)
      .join("\n");

    // 1) Generic webhook (required)
    const webhookUrl = Deno.env.get("WEBHOOK_URL") ?? "";
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "offer_created",
          offer,
          listing,
          seller_email: sellerEmail,
        }),
      });
    }

    // 2) Telegram (optional)
    const tgToken = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
    const tgChatId = Deno.env.get("TELEGRAM_CHAT_ID") ?? "";
    if (tgToken && tgChatId) {
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: msgText,
          disable_web_page_preview: true,
        }),
      });
    }

    // 3) Email via Resend (optional)
    const resendKey = Deno.env.get("RESEND_API_KEY") ?? "";
    const fromEmail = Deno.env.get("MAIL_FROM") ?? "";
    if (resendKey && fromEmail && sellerEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [sellerEmail],
          subject: "Új ajánlat érkezett",
          text: msgText,
        }),
      });
    }

    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, error: (e as any)?.message ?? String(e) }, 500);
  }
});
