# Autóbazár – MVP notes

Scope (v1): Komárom-Esztergom megye jármű marketplace

## Decisions
- Domain: autobazar.hu
- Auth: email magic link
- Moderation: listings require admin approval before publish
- Admin email: marky.genoff@gmail.com
- Notifications: Web Push + Email (SMS later)

## Next steps (when you have 5 minutes to log in)
1) Create GitHub repo: `autobazar` (private/public your choice)
2) Connect to Vercel and deploy
3) Create Supabase project and add env vars:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (server only)
   - NEXT_PUBLIC_SITE_URL (e.g. https://autobazar.hu)
4) Configure email provider (Resend/SMTP) for magic links + notification emails.

## Local dev
```bash
npm run dev
```

> Note: On this Windows host, PowerShell may block npm.ps1; use `cmd /c npm ...` if needed.
