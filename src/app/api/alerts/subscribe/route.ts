import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) throw new Error("Supabase env missing");
  return createClient(url, service, { auth: { persistSession: false } });
}

function getIp(req: NextRequest) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "";
}

function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getClient();

    const auth = req.headers.get("authorization") ?? "";
    const jwt = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
    if (!jwt) return NextResponse.json({ ok: false, error: "missing_auth" }, { status: 401 });

    const { data: userRes, error: uerr } = await supabase.auth.getUser(jwt);
    if (uerr) return NextResponse.json({ ok: false, error: uerr.message }, { status: 401 });

    const user = userRes.user;
    if (!user) return NextResponse.json({ ok: false, error: "not_authed" }, { status: 401 });

    const body = await req.json();
    const priceMin = body.priceMin != null && body.priceMin !== "" ? Number(body.priceMin) : null;
    const priceMax = body.priceMax != null && body.priceMax !== "" ? Number(body.priceMax) : null;
    const categories = Array.isArray(body.categories) ? (body.categories as string[]) : null;
    const hpOnly = Boolean(body.hungarianPlatesOnly);

    const emailEnabled = body.emailEnabled !== false;
    const telegramEnabled = Boolean(body.telegramEnabled);

    const ip = getIp(req);
    if (!ip) return NextResponse.json({ ok: false, error: "ip_missing" }, { status: 400 });

    const ipHash = sha256(ip);
    const now = new Date();

    // 7-day trial per IP (only for listing alerts feature)
    const { data: existingTrial, error: terr } = await supabase
      .from("ip_trials")
      .select("ip_hash, trial_ends_at")
      .eq("ip_hash", ipHash)
      .maybeSingle();
    if (terr) throw new Error(terr.message);

    let trialEndsAt: Date;
    if (!existingTrial) {
      trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const { error: insErr } = await supabase.from("ip_trials").insert({
        ip_hash: ipHash,
        trial_started_at: now.toISOString(),
        trial_ends_at: trialEndsAt.toISOString(),
      });
      if (insErr) throw new Error(insErr.message);
    } else {
      trialEndsAt = new Date(existingTrial.trial_ends_at);
    }

    if (trialEndsAt.getTime() <= now.getTime()) {
      return NextResponse.json({ ok: false, error: "trial_expired" }, { status: 402 });
    }

    // Upsert single subscription per user (MVP)
    const { data: existingSub, error: subErr } = await supabase
      .from("alert_subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (subErr) throw new Error(subErr.message);

    const payload: any = {
      user_id: user.id,
      enabled: true,
      valid_until: trialEndsAt.toISOString(),
      price_min: priceMin,
      price_max: priceMax,
      categories: categories && categories.length ? categories : null,
      hungarian_plates_only: hpOnly,
      email_enabled: emailEnabled,
      telegram_enabled: telegramEnabled,
    };

    if (!existingSub) {
      const { error } = await supabase.from("alert_subscriptions").insert(payload);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("alert_subscriptions").update(payload).eq("id", existingSub.id);
      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ ok: true, validUntil: trialEndsAt.toISOString() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
