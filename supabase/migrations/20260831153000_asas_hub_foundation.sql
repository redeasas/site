-- ASAS HUB: fundação aditiva de segurança e dados.
-- Não cria usuários, cobranças ou dados operacionais. Não armazena cartão.

create table if not exists public.asas_staff_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null check (role in ('admin','financeiro','relacionamento','projetos','auditoria')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.asas_has_role(allowed_roles text[])
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.asas_staff_profiles p where p.user_id = auth.uid() and p.active and p.role = any(allowed_roles)); $$;
revoke all on function public.asas_has_role(text[]) from public, anon;
grant execute on function public.asas_has_role(text[]) to authenticated;

create table if not exists public.asas_audit_log (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  summary jsonb not null default '{}'::jsonb
);

create table if not exists public.asas_supporters (
  id uuid primary key default gen_random_uuid(),
  asa_number text unique,
  full_name text not null,
  email text,
  phone text,
  city text,
  state char(2),
  status text not null default 'prospect' check (status in ('prospect','ativo','pausado','encerrado')),
  source text,
  owner_id uuid references auth.users(id) on delete set null,
  joined_at date,
  monthly_amount numeric(12,2) check (monthly_amount is null or monthly_amount >= 0),
  gateway_customer_ref text unique,
  consent_at timestamptz,
  retention_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.asas_payment_events (
  id uuid primary key default gen_random_uuid(),
  supporter_id uuid references public.asas_supporters(id) on delete restrict,
  gateway_event_id text not null unique,
  gateway_reference text,
  event_type text not null,
  status text not null check (status in ('pendente','confirmado','falhou','estornado','cancelado')),
  amount numeric(12,2) check (amount is null or amount >= 0),
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  raw_payload jsonb not null default '{}'::jsonb
);
comment on table public.asas_payment_events is 'Somente referências e eventos do gateway. Nunca armazenar número completo, CVV ou dados sensíveis de cartão.';

create table if not exists public.asas_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  cnpj text,
  contact_name text,
  email text,
  phone text,
  segment text,
  interest text,
  stage text not null default 'novo_lead' check (stage in ('novo_lead','contato','reuniao','proposta','negociacao','parceiro','nao_avancou','inativo')),
  owner_id uuid references auth.users(id) on delete set null,
  next_action_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.asas_volunteers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  profession text,
  skills text[],
  availability text,
  project_interest text,
  status text not null default 'novo' check (status in ('novo','entrevista','aprovado','ativo','pausado','encerrado')),
  consent_at timestamptz,
  retention_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.asas_impact_indicators (
  id uuid primary key default gen_random_uuid(),
  project text not null,
  name text not null,
  numeric_value numeric,
  text_value text,
  period_start date not null,
  period_end date not null,
  source text not null,
  methodology text not null,
  owner_id uuid references auth.users(id) on delete set null,
  status text not null default 'rascunho' check (status in ('rascunho','em_validacao','aprovado','publicado')),
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (period_end >= period_start),
  check (status not in ('aprovado','publicado') or (approved_by is not null and approved_at is not null))
);

create table if not exists public.asas_knowledge_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  content text not null,
  source text not null,
  status text not null default 'rascunho' check (status in ('rascunho','publicado','arquivado')),
  owner_id uuid references auth.users(id) on delete set null,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'publicado' or (reviewed_by is not null and reviewed_at is not null and published_at is not null))
);

create index if not exists asas_supporters_status_idx on public.asas_supporters(status, created_at desc);
create index if not exists asas_payment_events_supporter_idx on public.asas_payment_events(supporter_id, occurred_at desc);
create index if not exists asas_organizations_stage_idx on public.asas_organizations(stage, updated_at desc);
create index if not exists asas_volunteers_status_idx on public.asas_volunteers(status, updated_at desc);
create index if not exists asas_impact_status_idx on public.asas_impact_indicators(status, period_end desc);
create index if not exists asas_knowledge_status_idx on public.asas_knowledge_entries(status, updated_at desc);

alter table public.asas_staff_profiles enable row level security;
alter table public.asas_audit_log enable row level security;
alter table public.asas_supporters enable row level security;
alter table public.asas_payment_events enable row level security;
alter table public.asas_organizations enable row level security;
alter table public.asas_volunteers enable row level security;
alter table public.asas_impact_indicators enable row level security;
alter table public.asas_knowledge_entries enable row level security;

revoke all on public.asas_staff_profiles, public.asas_audit_log, public.asas_supporters,
  public.asas_payment_events, public.asas_organizations, public.asas_volunteers,
  public.asas_impact_indicators, public.asas_knowledge_entries from anon;

grant select, insert, update, delete on public.asas_staff_profiles, public.asas_supporters,
  public.asas_organizations, public.asas_volunteers, public.asas_impact_indicators,
  public.asas_knowledge_entries to authenticated;
grant select on public.asas_audit_log, public.asas_payment_events to authenticated;

create policy "staff reads own profile" on public.asas_staff_profiles for select to authenticated using (user_id = auth.uid() or public.asas_has_role(array['admin','auditoria']));
create policy "admin manages staff" on public.asas_staff_profiles for all to authenticated using (public.asas_has_role(array['admin'])) with check (public.asas_has_role(array['admin']));
create policy "authorized reads audit" on public.asas_audit_log for select to authenticated using (public.asas_has_role(array['admin','auditoria']));
create policy "relationship manages supporters" on public.asas_supporters for all to authenticated using (public.asas_has_role(array['admin','financeiro','relacionamento','auditoria'])) with check (public.asas_has_role(array['admin','financeiro','relacionamento']));
create policy "finance reads payments" on public.asas_payment_events for select to authenticated using (public.asas_has_role(array['admin','financeiro','auditoria']));
create policy "service writes payments" on public.asas_payment_events for all to service_role using (true) with check (true);
create policy "relationship manages organizations" on public.asas_organizations for all to authenticated using (public.asas_has_role(array['admin','relacionamento','auditoria'])) with check (public.asas_has_role(array['admin','relacionamento']));
create policy "relationship manages volunteers" on public.asas_volunteers for all to authenticated using (public.asas_has_role(array['admin','relacionamento','projetos','auditoria'])) with check (public.asas_has_role(array['admin','relacionamento','projetos']));
create policy "projects manage impact" on public.asas_impact_indicators for all to authenticated using (public.asas_has_role(array['admin','projetos','auditoria'])) with check (public.asas_has_role(array['admin','projetos']));
create policy "staff manages knowledge" on public.asas_knowledge_entries for all to authenticated using (public.asas_has_role(array['admin','relacionamento','projetos','auditoria'])) with check (public.asas_has_role(array['admin','relacionamento','projetos']));

create or replace function public.asas_write_audit()
returns trigger language plpgsql security definer set search_path = public
as $$
declare record_id text;
begin
  record_id := coalesce(
    to_jsonb(new) ->> 'id', to_jsonb(old) ->> 'id',
    to_jsonb(new) ->> 'user_id', to_jsonb(old) ->> 'user_id'
  );
  insert into public.asas_audit_log(actor_id, action, entity_type, entity_id, summary)
  values (auth.uid(), tg_op, tg_table_name, record_id,
    jsonb_build_object('changed_at', now()));
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
revoke all on function public.asas_write_audit() from public, anon, authenticated;

do $$
declare t text;
begin
  foreach t in array array['asas_staff_profiles','asas_supporters','asas_payment_events','asas_organizations','asas_volunteers','asas_impact_indicators','asas_knowledge_entries'] loop
    execute format('drop trigger if exists %I on public.%I', t || '_audit', t);
    execute format('create trigger %I after insert or update or delete on public.%I for each row execute function public.asas_write_audit()', t || '_audit', t);
  end loop;
end $$;

create or replace view public.asas_public_impact as
select id, project, name, numeric_value, text_value, period_start, period_end, source, methodology, published_at
from public.asas_impact_indicators where status = 'publicado';

create or replace view public.asas_public_knowledge as
select id, title, category, content, source, published_at, updated_at
from public.asas_knowledge_entries where status = 'publicado';

revoke all on public.asas_public_impact, public.asas_public_knowledge from anon, authenticated;
grant select on public.asas_public_impact, public.asas_public_knowledge to service_role;
