create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'purge-expired-asas-leads',
  '15 3 * * *',
  $$select public.purge_expired_asas_leads();$$
)
where not exists (
  select 1 from cron.job where jobname = 'purge-expired-asas-leads'
);
