-- JárműBazár Supabase schema (Phase 1 + Phase 2 scaffold)
-- Run in Supabase SQL Editor.

-- Extensions
create extension if not exists pgcrypto;
create extension if not exists pg_net;

-- 1) Listings
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  owner_id uuid not null,

  status text not null default 'pending' check (status in ('pending','approved','rejected')),

  category text not null check (category in ('Autó','Motor','Alkatrész')),
  title text not null,
  description text,
  price integer not null check (price > 0),
  location text not null,

  -- Car-specific
  brand text,
  model text,
  year integer,
  km integer,
  fuel text,
  transmission text,
  body_type text,
  hungarian_plates boolean,

  featured boolean not null default false
);

create index if not exists listings_status_idx on public.listings (status);
create index if not exists listings_category_idx on public.listings (category);
create index if not exists listings_brand_idx on public.listings (brand);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_listings_updated_at'
  ) then
    create trigger set_listings_updated_at
    before update on public.listings
    for each row execute function public.set_updated_at();
  end if;
end $$;

-- 2) Admin allowlist
create table if not exists public.admin_allowlist (
  email text primary key,
  created_at timestamptz not null default now()
);

-- Seed first admin
insert into public.admin_allowlist (email)
values ('marky.genoff@gmail.com')
on conflict (email) do nothing;

-- 3) Offers (Phase 2 - private)
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id uuid not null,

  offer_price integer not null check (offer_price > 0),
  message text,
  status text not null default 'pending' check (status in ('pending','accepted','rejected','countered','expired')),
  counter_price integer,

  -- prevent spam: one offer per buyer per listing (MVP)
  unique (listing_id, buyer_id)
);

create index if not exists offers_listing_idx on public.offers (listing_id);

-- 4) Alert subscriptions (Phase 3 - listing notifications)
create table if not exists public.alert_subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  user_id uuid not null,
  enabled boolean not null default true,

  -- trial/paid gating: if null => disabled by backend; if set => allowed until this time
  valid_until timestamptz,

  -- Filters (MVP)
  price_min integer,
  price_max integer,
  categories text[],
  hungarian_plates_only boolean not null default false,

  -- Channels (MVP)
  email_enabled boolean not null default true,
  telegram_enabled boolean not null default false,
  telegram_chat_id text
);

create index if not exists alert_subscriptions_user_idx on public.alert_subscriptions (user_id);

create table if not exists public.alert_deliveries (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  subscription_id uuid not null references public.alert_subscriptions(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  unique (subscription_id, listing_id)
);

create table if not exists public.ip_trials (
  ip_hash text primary key,
  created_at timestamptz not null default now(),
  trial_started_at timestamptz not null default now(),
  trial_ends_at timestamptz not null
);

-- RLS
alter table public.listings enable row level security;
alter table public.offers enable row level security;
alter table public.admin_allowlist enable row level security;
alter table public.alert_subscriptions enable row level security;
alter table public.alert_deliveries enable row level security;
alter table public.ip_trials enable row level security;

-- Helper: is_admin(email)
create or replace function public.is_admin(email text)
returns boolean
language sql
stable
as $$
  select exists(select 1 from public.admin_allowlist a where a.email = email);
$$;

-- ADMIN ALLOWLIST policies
-- Only admins can read/modify allowlist
create policy if not exists "admin_allowlist_admin_read" on public.admin_allowlist
for select
using (public.is_admin((auth.jwt() ->> 'email')));

create policy if not exists "admin_allowlist_admin_write" on public.admin_allowlist
for all
using (public.is_admin((auth.jwt() ->> 'email')))
with check (public.is_admin((auth.jwt() ->> 'email')));

-- ALERT_DELIVERIES policies
-- (kept private; only service role should write; admins can read if needed)
create policy if not exists "alert_deliveries_admin_read" on public.alert_deliveries
for select
using (public.is_admin((auth.jwt() ->> 'email')));

-- LISTINGS policies
-- Public can read only approved listings
create policy if not exists "listings_public_read_approved" on public.listings
for select
using (status = 'approved');

-- Owner can read own listings
create policy if not exists "listings_owner_read" on public.listings
for select
using (auth.uid() = owner_id);

-- Owner can insert own listings (always pending)
create policy if not exists "listings_owner_insert" on public.listings
for insert
with check (auth.uid() = owner_id and status = 'pending');

-- Owner can update own listing if still pending (edit before approval)
create policy if not exists "listings_owner_update_pending" on public.listings
for update
using (auth.uid() = owner_id and status = 'pending')
with check (auth.uid() = owner_id and status = 'pending');

-- Admin can read/update everything
create policy if not exists "listings_admin_read" on public.listings
for select
using (public.is_admin((auth.jwt() ->> 'email')));

create policy if not exists "listings_admin_update" on public.listings
for update
using (public.is_admin((auth.jwt() ->> 'email')))
with check (public.is_admin((auth.jwt() ->> 'email')));

-- ALERT_SUBSCRIPTIONS policies
-- User can manage own subscriptions
create policy if not exists "alert_subscriptions_owner_select" on public.alert_subscriptions
for select
using (auth.uid() = user_id);

create policy if not exists "alert_subscriptions_owner_insert" on public.alert_subscriptions
for insert
with check (auth.uid() = user_id);

create policy if not exists "alert_subscriptions_owner_update" on public.alert_subscriptions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy if not exists "alert_subscriptions_owner_delete" on public.alert_subscriptions
for delete
using (auth.uid() = user_id);

-- OFFERS policies (private)
-- Buyer can insert offer
create policy if not exists "offers_buyer_insert" on public.offers
for insert
with check (auth.uid() = buyer_id);

-- Buyer can read own offers
create policy if not exists "offers_buyer_read" on public.offers
for select
using (auth.uid() = buyer_id);

-- Seller can read offers on their listings
create policy if not exists "offers_seller_read" on public.offers
for select
using (
  exists(
    select 1 from public.listings l
    where l.id = offers.listing_id
      and l.owner_id = auth.uid()
  )
);

-- Buyer can update own offer when pending
create policy if not exists "offers_buyer_update_pending" on public.offers
for update
using (auth.uid() = buyer_id and status = 'pending')
with check (auth.uid() = buyer_id);

-- Seller can update offer status on their listing
create policy if not exists "offers_seller_update" on public.offers
for update
using (
  exists(
    select 1 from public.listings l
    where l.id = offers.listing_id
      and l.owner_id = auth.uid()
  )
)
with check (
  exists(
    select 1 from public.listings l
    where l.id = offers.listing_id
      and l.owner_id = auth.uid()
  )
);

-- Admin can read/update all offers
create policy if not exists "offers_admin_read" on public.offers
for select
using (public.is_admin((auth.jwt() ->> 'email')));

create policy if not exists "offers_admin_update" on public.offers
for update
using (public.is_admin((auth.jwt() ->> 'email')))
with check (public.is_admin((auth.jwt() ->> 'email')));

-- NOTIFY on new offer (Phase 2 optional)
-- This calls the Edge Function `offer-created` via pg_net.
-- IMPORTANT: set your own secret (DB_WEBHOOK_SECRET) below and in the Edge Function env.
create or replace function public.notify_offer_created()
returns trigger
language plpgsql
security definer
as $$
declare
  url text := current_setting('app.offer_created_url', true);
  secret text := current_setting('app.offer_created_secret', true);
  headers jsonb;
  body jsonb;
begin
  -- If not configured, do nothing (safe default)
  if url is null or url = '' then
    return new;
  end if;

  headers := jsonb_build_object(
    'content-type','application/json',
    'authorization', case when secret is null then '' else 'Bearer ' || secret end
  );

  body := jsonb_build_object(
    'offer_id', new.id,
    'listing_id', new.listing_id,
    'buyer_id', new.buyer_id,
    'offer_price', new.offer_price,
    'message', new.message
  );

  perform net.http_post(
    url := url,
    headers := headers,
    body := body
  );

  return new;
end;
$$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'tr_notify_offer_created') then
    create trigger tr_notify_offer_created
    after insert on public.offers
    for each row execute function public.notify_offer_created();
  end if;
end $$;

-- NOTIFY on listing approved (Phase 3 - alerts)
create or replace function public.notify_listing_approved()
returns trigger
language plpgsql
security definer
as $$
declare
  url text := current_setting('app.listing_approved_url', true);
  secret text := current_setting('app.listing_approved_secret', true);
  headers jsonb;
  body jsonb;
begin
  -- only on transition to approved
  if new.status <> 'approved' or (old.status is not distinct from new.status) then
    return new;
  end if;

  if url is null or url = '' then
    return new;
  end if;

  headers := jsonb_build_object(
    'content-type','application/json',
    'authorization', case when secret is null then '' else 'Bearer ' || secret end
  );

  body := jsonb_build_object('listing_id', new.id);

  perform net.http_post(
    url := url,
    headers := headers,
    body := body
  );

  return new;
end;
$$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'tr_notify_listing_approved') then
    create trigger tr_notify_listing_approved
    after update of status on public.listings
    for each row execute function public.notify_listing_approved();
  end if;
end $$;
