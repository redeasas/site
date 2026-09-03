-- Conciliação financeira: distingue valor bruto, tarifa do gateway e líquido.
-- Campos permanecem nulos quando o provedor não informar valores conciliados.

alter table public.asas_payment_events
  add column if not exists fee_amount numeric(12,2)
    check (fee_amount is null or fee_amount >= 0),
  add column if not exists net_amount numeric(12,2)
    check (net_amount is null or net_amount >= 0),
  add column if not exists billing_type text;

comment on column public.asas_payment_events.amount is
  'Valor bruto informado pelo gateway.';
comment on column public.asas_payment_events.fee_amount is
  'Tarifa efetivamente informada/derivada do valor líquido conciliado; nunca estimada.';
comment on column public.asas_payment_events.net_amount is
  'Valor líquido informado pelo gateway.';

