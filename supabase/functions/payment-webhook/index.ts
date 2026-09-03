import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async request => {
  if (request.method !== "POST") return new Response("method_not_allowed",{status:405});
  const expected = Deno.env.get("ASAAS_WEBHOOK_TOKEN");
  const received = request.headers.get("asaas-access-token");
  if (!expected || !received || received !== expected) return new Response("unauthorized",{status:401});
  let payload: Record<string,any>;
  try { payload = await request.json(); } catch { return new Response("invalid_json",{status:400}); }
  const event = String(payload.event || ""), payment = payload.payment || {};
  if (!event || !payment.id) return new Response("ignored",{status:200});
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false}});
  const agreementRef = String(payment.externalReference || "");
  let {data:agreement} = await supabase.from("asas_recurring_agreements").select("id,supporter_id").eq("id",agreementRef).maybeSingle();
  if (!agreement && payment.checkoutSession) {
    const {data:checkout} = await supabase.from("asas_checkout_sessions").select("agreement_id").eq("provider_checkout_ref",String(payment.checkoutSession)).maybeSingle();
    if (checkout?.agreement_id) ({data:agreement} = await supabase.from("asas_recurring_agreements").select("id,supporter_id").eq("id",checkout.agreement_id).maybeSingle());
  }
  if (!agreement) return new Response("unmatched",{status:200});
  const statusMap: Record<string,string> = {PAYMENT_CREATED:"pendente",PAYMENT_CONFIRMED:"confirmado",PAYMENT_RECEIVED:"confirmado",PAYMENT_OVERDUE:"falhou",PAYMENT_REFUNDED:"estornado",PAYMENT_DELETED:"cancelado",PAYMENT_CREDIT_CARD_CAPTURE_REFUSED:"falhou"};
  const status = statusMap[event];
  if (!status) return new Response("ignored",{status:200});
  const eventId = String(payload.id || `${event}:${payment.id}:${payment.status || ""}`);
  const grossAmount = Number(payment.value);
  const netAmount = Number(payment.netValue);
  const hasGross = Number.isFinite(grossAmount) && grossAmount >= 0;
  const hasNet = Number.isFinite(netAmount) && netAmount >= 0;
  const feeAmount = hasGross && hasNet ? Math.max(0,grossAmount-netAmount) : null;
  const {error} = await supabase.from("asas_payment_events").insert({supporter_id:agreement.supporter_id,gateway_event_id:eventId,gateway_reference:String(payment.id),event_type:event,status,amount:hasGross?grossAmount:null,fee_amount:feeAmount,net_amount:hasNet?netAmount:null,billing_type:payment.billingType||null,occurred_at:String(payload.dateCreated || new Date().toISOString()),raw_payload:{event,billingType:payment.billingType||null,dueDate:payment.dueDate||null,subscription:payment.subscription||null}});
  if (error && error.code !== "23505") return new Response("storage_failed",{status:500});
  if (["PAYMENT_CONFIRMED","PAYMENT_RECEIVED"].includes(event)) {
    await supabase.from("asas_recurring_agreements").update({status:"ativo",provider_subscription_ref:payment.subscription||null,updated_at:new Date().toISOString()}).eq("id",agreement.id);
    await supabase.rpc("asas_activate_supporter",{target_supporter:agreement.supporter_id});
  }
  if (["PAYMENT_REFUNDED","PAYMENT_DELETED"].includes(event)) await supabase.from("asas_recurring_agreements").update({status:event==="PAYMENT_REFUNDED"?"falhou":"cancelado",updated_at:new Date().toISOString()}).eq("id",agreement.id);
  return new Response("ok",{status:200});
});
