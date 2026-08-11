alter table public.asas_leads
  add column if not exists status text not null default 'novo'
    check (status in ('novo', 'em_atendimento', 'concluido', 'spam')),
  add column if not exists assigned_to text,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists retention_until timestamptz
    not null default (now() + interval '24 months'),
  add column if not exists notification_status text not null default 'pendente'
    check (notification_status in ('pendente', 'enviada', 'falhou', 'dispensada')),
  add column if not exists notification_error text;

create index if not exists asas_leads_status_created_idx
  on public.asas_leads (status, created_at desc);
create index if not exists asas_leads_retention_idx
  on public.asas_leads (retention_until);

comment on column public.asas_leads.retention_until is
  'Prazo operacional padrão de 24 meses; deve ser antecipado quando o titular solicitar exclusão ou a finalidade se encerrar.';

create or replace function public.purge_expired_asas_leads()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare deleted_count integer;
begin
  delete from public.asas_leads where retention_until <= now();
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.purge_expired_asas_leads() from public, anon, authenticated;
grant execute on function public.purge_expired_asas_leads() to service_role;
