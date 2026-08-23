alter table public.asas_leads
  add column if not exists company_cnpj text,
  add column if not exists company_role text,
  add column if not exists company_city text,
  add column if not exists company_state text,
  add column if not exists company_segment text,
  add column if not exists company_size text,
  add column if not exists cause_interest text,
  add column if not exists support_type text,
  add column if not exists investment_range text,
  add column if not exists decision_deadline text,
  add column if not exists project_interest text,
  add column if not exists lead_score integer not null default 0 check (lead_score between 0 and 100),
  add column if not exists lead_classification text not null default 'novo'
    check (lead_classification in ('novo','qualificado','oportunidade','prioridade')),
  add column if not exists pipeline_stage text not null default 'novo_lead'
    check (pipeline_stage in ('novo_lead','qualificacao','contato_realizado','diagnostico','reuniao','proposta','negociacao','parceria','execucao','relatorio','renovacao','pos_parceria')),
  add column if not exists protocol text unique;

create index if not exists asas_leads_pipeline_idx on public.asas_leads (pipeline_stage, created_at desc);
create index if not exists asas_leads_classification_idx on public.asas_leads (lead_classification, created_at desc);

comment on column public.asas_leads.lead_score is 'Pontuação interna de qualificação; nunca deve ser enviada ao visitante.';
comment on column public.asas_leads.protocol is 'Protocolo público sem informação pessoal, gerado no recebimento.';
