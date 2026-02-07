import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { ok: false, error: "TURNSTILE_SECRET_KEY not configured" },
        { status: 400 }
      );
    }

    const body = (await req.json()) as { token?: string };
    const token = body?.token;

    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
    }

    const form = new FormData();
    form.append("secret", secret);
    form.append("response", token);

    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });

    const data = (await r.json()) as { success?: boolean; "error-codes"?: string[] };

    if (!data?.success) {
      return NextResponse.json(
        { ok: false, error: "Turnstile failed", codes: data?.["error-codes"] ?? [] },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
