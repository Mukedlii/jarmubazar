// Supabase Edge Function: listing-approved-alert
// Called by Postgres trigger (pg_net) when a listing transitions to status='approved'.
// Sends alerts to matching subscriptions (trial/paid via valid_until).

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type Payload = {
  listing_id: string;
};

type Subscription = {
  id: string;
  user_id: string;
  enabled: boolean;
  valid_until: string | null;
  price_min: number | null;
  price_max: number | null;
  categories: string[] | null;
  hungarian_plates_only: boolean;
  email_enabled: boolean;
  telegram_enabled: boolean;
  telegram_chat_id: string | null;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function nowIso() {
  return new Date().toISOString();
}

function matches(sub: Subscription, listing: any) {
  if (!sub.enabled) return false;
  if (sub.valid_until && sub.valid_until <= nowIso()) return false;

  if (sub.price_min != null && (listing.price ?? 0) < sub.price_min) return false;
  if (sub.price_max != null && (listing.price ?? 0) > sub.price_max) return false;

  if (sub.categories && sub.categories.length > 0) {
    if (!sub.categories.includes(listing.category)) return false;
  }

  if (sub.hungarian_plates_only) {
    const hp = listing.hungarian_plates ?? listing.hungarianPlates;
    if (!hp) return false;
  }

  return true;
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
    if (!payload?.listing_id) return json({ error: "missing_listing_id" }, 400);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const { data: listing, error: lerr } = await supabaseAdmin
      .from("listings")
      .select("id, title, price, category, location, hungarian_plates, created_at, owner_id, status")
      .eq("id", payload.listing_id)
      .maybeSingle();

    if (lerr) throw new Error(lerr.message);
    if (!listing) throw new Error("Listing not found");
    if (listing.status !== "approved") return json({ ok: true, skipped: true, reason: "not_approved" });

    const { data: subs, error: serr } = await supabaseAdmin
      .from("alert_subscriptions")
      .select(
        "id, user_id, enabled, valid_until, price_min, price_max, categories, hungarian_plates_only, email_enabled, telegram_enabled, telegram_chat_id"
      )
      .eq("enabled", true);

    if (serr) throw new Error(serr.message);

    const matched = (subs ?? []).filter((s: any) => matches(s as Subscription, listing)) as Subscription[];

    const publicSiteUrl = (Deno.env.get("PUBLIC_SITE_URL") ?? "").replace(/\/$/, "");
    const listingUrl = publicSiteUrl ? `${publicSiteUrl}/listing/${listing.id}` : "";

    const resendKey = Deno.env.get("RESEND_API_KEY") ?? "";
    const fromEmail = Deno.env.get("MAIL_FROM") ?? "";

    const tgToken = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";

    let sent = 0;
    let deduped = 0;

    for (const sub of matched) {
      // Dedupe per (sub, listing)
      const { error: derr } = await supabaseAdmin
        .from("alert_deliveries")
        .insert({ subscription_id: sub.id, listing_id: listing.id });

      if (derr) {
        // unique violation -> already delivered
        if ((derr as any).code === "23505") {
          deduped++;
          continue;
        }
        // non-fatal: continue
      }

      const { data: userRes, error: uerr } = await supabaseAdmin.auth.admin.getUserById(sub.user_id);
      if (uerr) continue;
      const email = userRes.user?.email ?? null;

      const text = [
        "Új jóváhagyott hirdetés a szűrőid alapján",
        `Cím: ${listing.title}`,
        `Ár: ${listing.price} Ft",
        `Kategória: ${listing.category}",
        listing.location ? `Település: ${listing.location}` : null,
        listingUrl ? `Link: ${listingUrl}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      // Email
      if (sub.email_enabled && resendKey && fromEmail && email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [email],
            subject: "Új hirdetés értesítés",
            text,
          }),
        });
        sent++;
      }

      // Telegram
      if (sub.telegram_enabled && tgToken && sub.telegram_chat_id) {
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: sub.telegram_chat_id,
            text,
            disable_web_page_preview: true,
          }),
        });
        sent++;
      }
    }

    return json({ ok: true, matched: matched.length, sent, deduped });
  } catch (e) {
    return json({ ok: false, error: (e as any)?.message ?? String(e) }, 500);
  }
});
