# Supabase setup (otthon 10-15 perc)

## 0) Mi kell hozzá?
- Supabase dashboard hozzáférés
- A Vercel projekt (jarmubazar)

## 1) Supabase projekt
1. https://supabase.com/dashboard
2. New project
   - Name: `jarmubazar`
   - Region: EU (pl. Frankfurt) (bármi ok)

## 2) Auth (Magic link)
- Authentication → Providers → Email: **Enable**
- Authentication → URL Configuration:
  - Site URL: `https://<vercel-production-domain>` (egyelőre a vercel.app)
  - Additional Redirect URLs:
    - `https://<vercel-preview-domain>/auth/callback`
    - `https://<vercel-production-domain>/auth/callback`

## 3) Env varok (Vercel + local)
Vercel → Project → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` = Project Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Project Settings → API → anon public

Local (ha kell): `.env.local` ugyan ezekkel.

## 4) SQL schema (KÖTELEZŐ)
Supabase Dashboard → **SQL Editor** → futtasd le ezt a fájlt:
- `supabase/schema.sql`

Ez hozza létre többek között:
- `listings` tábla
- `offers` tábla (ajánlatok)
- RLS policy-k (ki mit láthat / módosíthat)

## 5) Admin email (később)
Admin whitelistet majd szerver oldalon (RLS + service role) fogunk megoldani.
Első admin: `marky.genoff@gmail.com`

## 6) Teszt
- `/login` → add meg az emailt → magic link
- link a `/auth/callback`-re fog visszajönni
- Nyiss meg egy hirdetést → **Ajánlat tétel** (csak login után)
- Eladó/admin: **/offers** oldalon látja a beérkezett ajánlatokat

Megjegyzés: saját domain NEM kell a működéshez, csak az "éles" feladóhoz/deliverability-hez ajánlott.
