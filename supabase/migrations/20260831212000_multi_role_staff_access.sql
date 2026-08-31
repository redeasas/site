-- Permite múltiplas funções por pessoa sem contas compartilhadas ou duplicadas.
alter table public.asas_staff_profiles add column if not exists roles text[];
update public.asas_staff_profiles set roles = array[role] where roles is null or cardinality(roles) = 0;
alter table public.asas_staff_profiles alter column roles set not null;
alter table public.asas_staff_profiles add constraint asas_staff_profiles_roles_check
  check (cardinality(roles) between 1 and 5 and roles <@ array['admin','financeiro','relacionamento','projetos','auditoria']::text[]);

create or replace function public.asas_has_role(allowed_roles text[])
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.asas_staff_profiles p where p.user_id = auth.uid() and p.active and (p.roles && allowed_roles or p.role = any(allowed_roles))); $$;
revoke all on function public.asas_has_role(text[]) from public, anon;
grant execute on function public.asas_has_role(text[]) to authenticated;
