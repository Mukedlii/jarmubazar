import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) throw new Error("Supabase env missing");
  return createClient(url, service, { auth: { persistSession: false } });
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getClient();

    const auth = req.headers.get("authorization") ?? "";
    const jwt = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
    if (!jwt) return NextResponse.json({ ok: false, error: "missing_auth" }, { status: 401 });

    const { data: userRes, error: uerr } = await supabase.auth.getUser(jwt);
    if (uerr) return NextResponse.json({ ok: false, error: uerr.message }, { status: 401 });

    const user = userRes.user;
    if (!user) return NextResponse.json({ ok: false, error: "not_authed" }, { status: 401 });

    const { data, error } = await supabase
      .from("alert_subscriptions")
      .select(
        "id, enabled, valid_until, price_min, price_max, categories, hungarian_plates_only, email_enabled, telegram_enabled, telegram_chat_id"
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true, subscription: data ?? null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
