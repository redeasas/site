create extension if not exists pgcrypto;

create table if not exists public.asas_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  idempotency_key text not null unique,
  form_type text not null,
  name text not null,
  email text,
  phone text,
  interest text,
  organization text,
  message text,
  preferences text[],
  consent boolean not null default false,
  consent_at timestamptz,
  page_url text not null,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  user_agent text,
  ip_hash text
);

create index if not exists asas_leads_created_at_idx on public.asas_leads (created_at desc);
create index if not exists asas_leads_form_type_idx on public.asas_leads (form_type, created_at desc);

alter table public.asas_leads enable row level security;
revoke all on public.asas_leads from anon, authenticated;

create table if not exists public.asas_lead_rate_limits (
  ip_hash text not null,
  window_start timestamptz not null,
  request_count integer not null default 1,
  primary key (ip_hash, window_start)
);

alter table public.asas_lead_rate_limits enable row level security;
revoke all on public.asas_lead_rate_limits from anon, authenticated;

