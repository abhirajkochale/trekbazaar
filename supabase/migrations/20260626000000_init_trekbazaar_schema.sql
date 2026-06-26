-- TrekBazaar MVP schema: treks + enquiries
-- Phase 1: trek listings, search, and a public enquiry form.
-- No bookings, payments, or user accounts yet.

-- Needed for gen_random_uuid() on older Postgres; no-op if already present.
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- treks
-- ---------------------------------------------------------------------------
create table public.treks (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  description      text not null,
  region           text not null,
  difficulty       text not null
                     check (difficulty in ('easy', 'moderate', 'difficult', 'extreme')),
  duration_days    integer not null,
  price_per_person numeric not null,
  cover_image_url  text,
  operator_name    text not null,
  operator_contact text not null,
  status           text not null default 'draft'
                     check (status in ('draft', 'active', 'archived')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index treks_region_idx     on public.treks (region);
create index treks_difficulty_idx on public.treks (difficulty);
create index treks_status_idx     on public.treks (status);
-- slug already has a unique index from the UNIQUE constraint, so a separate
-- index would be redundant; the unique constraint covers slug lookups.

-- Keep updated_at current on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger treks_set_updated_at
  before update on public.treks
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- enquiries
-- ---------------------------------------------------------------------------
create table public.enquiries (
  id         uuid primary key default gen_random_uuid(),
  trek_id    uuid references public.treks (id) on delete set null,
  name       text not null,
  email      text not null,
  phone      text,
  message    text,
  status     text not null default 'open'
               check (status in ('open', 'responded', 'closed')),
  created_at timestamptz not null default now()
);

create index enquiries_trek_id_idx on public.enquiries (trek_id);
create index enquiries_status_idx  on public.enquiries (status);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- The service_role key bypasses RLS entirely, so it can already do all
-- operations on both tables — no policy is needed (or possible) to grant it
-- more. The policies below define exactly what the public anon key may do.
-- ---------------------------------------------------------------------------
alter table public.treks     enable row level security;
alter table public.enquiries enable row level security;

-- Public visitors (anon) and any future logged-in users may read only
-- treks whose status is 'active'. Drafts and archived treks stay hidden.
create policy "Public can read active treks"
  on public.treks
  for select
  to anon, authenticated
  using (status = 'active');

-- Public visitors may submit enquiries (so the enquiry form works without
-- login). They cannot read, update, or delete enquiries — no other policy
-- exists for them, and RLS denies anything not explicitly allowed.
create policy "Public can submit enquiries"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (true);
