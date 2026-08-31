-- Evolui o contato já capturado pelo site para um funil operacional único.
-- Não cria um segundo cadastro de leads.

alter table public.asas_leads
  add column if not exists next_action_at timestamptz,
  add column if not exists interaction_note text;

create index if not exists asas_leads_next_action_idx
  on public.asas_leads (next_action_at)
  where next_action_at is not null;

grant update (status, pipeline_stage, assigned_to, last_contacted_at, next_action_at, interaction_note)
  on public.asas_leads to authenticated;

comment on column public.asas_leads.next_action_at is
  'Próximo acompanhamento definido pela equipe responsável.';
comment on column public.asas_leads.interaction_note is
  'Nota operacional breve; não inserir dados sensíveis ou documentos.';

