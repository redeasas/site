-- Libera ao HUB somente leitura e atualização operacional de contatos, sempre sob RLS.
grant select on public.asas_leads to authenticated;
grant update (status, pipeline_stage, assigned_to, last_contacted_at) on public.asas_leads to authenticated;

create policy "hub staff reads leads"
on public.asas_leads for select to authenticated
using (public.asas_has_role(array['admin','relacionamento','auditoria']));

create policy "hub relationship updates lead workflow"
on public.asas_leads for update to authenticated
using (public.asas_has_role(array['admin','relacionamento']))
with check (public.asas_has_role(array['admin','relacionamento']));

drop trigger if exists asas_leads_audit on public.asas_leads;
create trigger asas_leads_audit
after update on public.asas_leads
for each row execute function public.asas_write_audit();

comment on policy "hub staff reads leads" on public.asas_leads is
  'Contatos são dados pessoais: acesso somente para perfis internos autorizados e autenticados.';
