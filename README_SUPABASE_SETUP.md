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

## 6) Értesítések (webhook / Telegram / email) – opcionális, de ajánlott
A repo tartalmaz egy Supabase Edge Functiont: `offer-created`.

### 6.1 Edge Function deploy
Supabase CLI-val (vagy Dashboardon) deployold:
- `supabase/functions/offer-created`

### 6.2 Environment változók (Supabase → Functions → Secrets)
- `DB_WEBHOOK_SECRET` = tetszőleges erős secret
- `WEBHOOK_URL` = a saját webhook endpointod (kötelező, ha értesítést akarsz)
- `PUBLIC_SITE_URL` = pl. `https://<vercel-domain>`

Telegram (opcionális):
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Email (opcionális, Resend):
- `RESEND_API_KEY`
- `MAIL_FROM` = pl. `JarmuBazar <no-reply@domain.tld>`

### 6.3 DB trigger konfigurálás
A `schema.sql` tartalmazza a trigger függvényt, ami a `app.offer_created_url` + `app.offer_created_secret` beállításokat olvassa.
SQL Editorban futtasd:
- `select set_config('app.offer_created_url','https://<project>.functions.supabase.co/offer-created', false);`
- `select set_config('app.offer_created_secret','<DB_WEBHOOK_SECRET>', false);`

## 7) Teszt
- `/login` → add meg az emailt → magic link
- link a `/auth/callback`-re fog visszajönni
- Nyiss meg egy hirdetést → **Ajánlat tétel** (csak login után)
- Eladó/admin: **/offers** oldalon látja a beérkezett ajánlatokat
- Új ajánlatnál: webhook/Telegram/email (ha bekonfigoltad)

Megjegyzés: saját domain NEM kell a működéshez, csak az "éles" feladóhoz/deliverability-hez ajánlott.
