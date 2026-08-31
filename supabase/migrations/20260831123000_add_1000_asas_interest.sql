alter table public.asas_leads
  add column if not exists monthly_amount_interest text;

create index if not exists asas_leads_1000_asas_idx
  on public.asas_leads (form_type, created_at desc)
  where form_type = '1000-asas-interesse';

comment on column public.asas_leads.monthly_amount_interest is
  'Valor mensal declarado como interesse; não representa cobrança, pagamento ou acordo recorrente.';
