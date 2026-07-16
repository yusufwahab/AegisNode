-- Aegis Node — scan → hospital alert pipeline
-- Run this in the Supabase SQL editor once the project exists.

create extension if not exists pgcrypto;

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  patient_ref text,
  name text not null,
  blood_type text,
  allergies text[] not null default '{}',
  conditions text[] not null default '{}',
  medications text[] not null default '{}',
  contact_relationship text,
  contact_phone text,
  status text not null default 'Incoming' check (status in ('Incoming', 'Arrived', 'Resolved')),
  created_at timestamptz not null default now()
);

alter table public.alerts enable row level security;

-- Public/anon read access — the hospital dashboard subscribes directly via
-- supabase-js with the anon key. No public write policy is defined on
-- purpose: inserts and status updates only happen through the Express
-- backend, which uses the service-role key and bypasses RLS entirely.
create policy "Public read access" on public.alerts
  for select
  using (true);

-- Required for the hospital dashboard's realtime subscription to receive
-- postgres_changes events for this table.
alter publication supabase_realtime add table public.alerts;
