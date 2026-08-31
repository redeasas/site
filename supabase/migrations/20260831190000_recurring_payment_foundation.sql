-- Infraestrutura de recorrência. Permanece inativa até credenciais Sandbox/Produção.

create sequence if not exists public.asas_number_seq start 1;
revoke all on sequence public.asas_number_seq from public, anon, authenticated;

create table if not exists public.asas_recurring_agreements (
  id uuid primary key default gen_random_uuid(),
  supporter_id uuid not null references public.asas_supporters(id) on delete restrict,
  provider text not null check (provider in ('asaas')),
  provider_subscription_ref text unique,
  status text not null default 'checkout_criado'
    check (status in ('checkout_criado','pendente','ativo','pausado','cancelado','falhou')),
  monthly_amount numeric(12,2) not null check (monthly_amount >= 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.asas_checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  supporter_id uuid not null references public.asas_supporters(id) on delete restrict,
  agreement_id uuid not null references public.asas_recurring_agreements(id) on delete restrict,
  provider text not null check (provider in ('asaas')),
  provider_checkout_ref text not null unique,
  status text not null default 'criado'
    check (status in ('criado','visualizado','concluido','expirado','cancelado','falhou')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists asas_agreements_supporter_idx
  on public.asas_recurring_agreements(supporter_id, created_at desc);
create index if not exists asas_checkout_supporter_idx
  on public.asas_checkout_sessions(supporter_id, created_at desc);

alter table public.asas_recurring_agreements enable row level security;
alter table public.asas_checkout_sessions enable row level security;
revoke all on public.asas_recurring_agreements, public.asas_checkout_sessions from anon;
grant select on public.asas_recurring_agreements, public.asas_checkout_sessions to authenticated;

create policy "finance reads recurring agreements"
on public.asas_recurring_agreements for select to authenticated
using (public.asas_has_role(array['admin','financeiro','relacionamento','auditoria']));

create policy "finance reads checkout sessions"
on public.asas_checkout_sessions for select to authenticated
using (public.asas_has_role(array['admin','financeiro','relacionamento','auditoria']));

create policy "service manages recurring agreements"
on public.asas_recurring_agreements for all to service_role using (true) with check (true);
create policy "service manages checkout sessions"
on public.asas_checkout_sessions for all to service_role using (true) with check (true);

drop trigger if exists asas_recurring_agreements_audit on public.asas_recurring_agreements;
create trigger asas_recurring_agreements_audit after insert or update or delete
on public.asas_recurring_agreements for each row execute function public.asas_write_audit();
drop trigger if exists asas_checkout_sessions_audit on public.asas_checkout_sessions;
create trigger asas_checkout_sessions_audit after insert or update or delete
on public.asas_checkout_sessions for each row execute function public.asas_write_audit();

create or replace function public.asas_activate_supporter(target_supporter uuid)
returns text language plpgsql security definer set search_path = public
as $$
declare result_number text;
begin
  update public.asas_supporters
  set status = 'ativo',
      joined_at = coalesce(joined_at, current_date),
      asa_number = coalesce(asa_number, 'ASA-' || lpad(nextval('public.asas_number_seq')::text, 6, '0')),
      updated_at = now()
  where id = target_supporter
  returning asa_number into result_number;
  return result_number;
end;
$$;
revoke all on function public.asas_activate_supporter(uuid) from public, anon, authenticated;
grant execute on function public.asas_activate_supporter(uuid) to service_role;

