-- Importação controlada de contatos históricos para o funil único do ASAS HUB.
-- Dados pessoais nunca devem ser incluídos em código-fonte ou migrações.

alter table public.asas_leads
  add column if not exists contact_status text not null default 'a_contatar'
    check (contact_status in ('a_contatar', 'contatado', 'sem_canal')),
  add column if not exists import_source text,
  add column if not exists source_record_key text,
  add column if not exists import_batch_id text;

create unique index if not exists asas_leads_source_record_key_idx
  on public.asas_leads (source_record_key)
  where source_record_key is not null;

create index if not exists asas_leads_contact_status_idx
  on public.asas_leads (contact_status, created_at desc);

grant update (contact_status) on public.asas_leads to authenticated;

comment on column public.asas_leads.contact_status is
  'Situação operacional simples: ainda será contatado, já contatado ou sem telefone/e-mail.';
comment on column public.asas_leads.source_record_key is
  'Hash técnico para impedir importação duplicada; não contém telefone, e-mail ou nome em texto aberto.';

