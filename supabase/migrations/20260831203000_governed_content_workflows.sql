-- Fluxos de aprovação do ASAS HUB.
-- Impede publicação direta por alteração comum e concentra transições em RPCs auditáveis.

alter table public.asas_knowledge_entries
  drop constraint if exists asas_knowledge_entries_status_check;
alter table public.asas_knowledge_entries
  add constraint asas_knowledge_entries_status_check
  check (status in ('rascunho','em_validacao','aprovado','publicado','arquivado'));

revoke update on public.asas_impact_indicators from authenticated;
revoke insert on public.asas_impact_indicators from authenticated;
grant insert (project, name, numeric_value, text_value, period_start, period_end, source, methodology, owner_id)
  on public.asas_impact_indicators to authenticated;
grant update (project, name, numeric_value, text_value, period_start, period_end, source, methodology, owner_id, updated_at)
  on public.asas_impact_indicators to authenticated;

revoke update on public.asas_knowledge_entries from authenticated;
revoke insert on public.asas_knowledge_entries from authenticated;
grant insert (title, category, content, source, owner_id)
  on public.asas_knowledge_entries to authenticated;
grant update (title, category, content, source, owner_id, updated_at)
  on public.asas_knowledge_entries to authenticated;

create or replace function public.asas_transition_impact(p_record_id uuid, p_target_status text)
returns public.asas_impact_indicators
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.asas_impact_indicators;
  result_row public.asas_impact_indicators;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  select * into current_row from public.asas_impact_indicators where id = p_record_id for update;
  if not found then raise exception 'indicator not found'; end if;

  if current_row.status = 'rascunho' and p_target_status = 'em_validacao' then
    if not public.asas_has_role(array['admin','projetos']) then raise exception 'forbidden'; end if;
  elsif current_row.status = 'em_validacao' and p_target_status = 'aprovado' then
    if not public.asas_has_role(array['admin']) then raise exception 'admin approval required'; end if;
  elsif current_row.status = 'aprovado' and p_target_status = 'publicado' then
    if not public.asas_has_role(array['admin']) then raise exception 'admin publication required'; end if;
  elsif p_target_status = 'rascunho' and current_row.status in ('em_validacao','aprovado') then
    if not public.asas_has_role(array['admin','projetos']) then raise exception 'forbidden'; end if;
  else
    raise exception 'invalid transition from % to %', current_row.status, p_target_status;
  end if;

  update public.asas_impact_indicators set
    status = p_target_status,
    approved_by = case when p_target_status in ('aprovado','publicado') then coalesce(approved_by, auth.uid()) else null end,
    approved_at = case when p_target_status in ('aprovado','publicado') then coalesce(approved_at, now()) else null end,
    published_at = case when p_target_status = 'publicado' then now() else null end,
    updated_at = now()
  where id = p_record_id returning * into result_row;
  return result_row;
end;
$$;

create or replace function public.asas_transition_knowledge(p_record_id uuid, p_target_status text)
returns public.asas_knowledge_entries
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.asas_knowledge_entries;
  result_row public.asas_knowledge_entries;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  select * into current_row from public.asas_knowledge_entries where id = p_record_id for update;
  if not found then raise exception 'content not found'; end if;

  if current_row.status = 'rascunho' and p_target_status = 'em_validacao' then
    if not public.asas_has_role(array['admin','relacionamento','projetos']) then raise exception 'forbidden'; end if;
  elsif current_row.status = 'em_validacao' and p_target_status = 'aprovado' then
    if not public.asas_has_role(array['admin']) then raise exception 'admin approval required'; end if;
  elsif current_row.status = 'aprovado' and p_target_status = 'publicado' then
    if not public.asas_has_role(array['admin']) then raise exception 'admin publication required'; end if;
  elsif p_target_status = 'rascunho' and current_row.status in ('em_validacao','aprovado') then
    if not public.asas_has_role(array['admin','relacionamento','projetos']) then raise exception 'forbidden'; end if;
  elsif p_target_status = 'arquivado' and current_row.status <> 'publicado' then
    if not public.asas_has_role(array['admin']) then raise exception 'admin archive required'; end if;
  else
    raise exception 'invalid transition from % to %', current_row.status, p_target_status;
  end if;

  update public.asas_knowledge_entries set
    status = p_target_status,
    reviewed_by = case when p_target_status in ('aprovado','publicado') then coalesce(reviewed_by, auth.uid()) else null end,
    reviewed_at = case when p_target_status in ('aprovado','publicado') then coalesce(reviewed_at, now()) else null end,
    published_at = case when p_target_status = 'publicado' then now() else null end,
    updated_at = now()
  where id = p_record_id returning * into result_row;
  return result_row;
end;
$$;

revoke all on function public.asas_transition_impact(uuid,text) from public, anon;
revoke all on function public.asas_transition_knowledge(uuid,text) from public, anon;
grant execute on function public.asas_transition_impact(uuid,text) to authenticated;
grant execute on function public.asas_transition_knowledge(uuid,text) to authenticated;

comment on function public.asas_transition_impact(uuid,text) is
  'Executa transições válidas dos indicadores; aprovação e publicação exigem administrador.';
comment on function public.asas_transition_knowledge(uuid,text) is
  'Executa transições válidas da base da IA; aprovação e publicação exigem administrador.';
