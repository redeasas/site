import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = new Set(["https://redeasas.github.io","https://redeasas.org.br","https://www.redeasas.org.br","http://127.0.0.1:4173","http://localhost:4173"]);
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0,max) : "";

Deno.serve(async request => {
  const origin = request.headers.get("origin") || "";
  const cors = {"Access-Control-Allow-Origin":allowedOrigins.has(origin)?origin:"https://redeasas.org.br","Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Vary":"Origin"};
  if (request.method === "OPTIONS") return new Response(null,{status:204,headers:cors});
  if (request.method !== "POST" || !allowedOrigins.has(origin)) return Response.json({error:"not_allowed"},{status:403,headers:cors});
  const apiKey = Deno.env.get("ASAAS_API_KEY");
  const environment = Deno.env.get("ASAAS_ENVIRONMENT") || "disabled";
  if (!apiKey || !["sandbox","production"].includes(environment)) return Response.json({error:"integration_not_configured"},{status:503,headers:cors});
  let body: Record<string,unknown>;
  try { body = await request.json(); } catch { return Response.json({error:"invalid_json"},{status:400,headers:cors}); }
  const name = clean(body.nome,120), email = clean(body.email,180).toLowerCase(), phone = clean(body.telefone,30);
  const amount = Number(body.valor_mensal);
  const consent = [true,"true","on","sim"].includes(body.consentimento as never);
  if (!name || !email || !phone || !consent || !Number.isFinite(amount) || amount < 10 || amount > 10000) return Response.json({error:"invalid_fields"},{status:422,headers:cors});
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false}});
  const {data:supporter,error:supporterError} = await supabase.from("asas_supporters").insert({full_name:name,email,phone,status:"prospect",source:"Checkout Campanha 1.000 ASAS",monthly_amount:amount,consent_at:new Date().toISOString()}).select("id").single();
  if (supporterError || !supporter) return Response.json({error:"supporter_storage_failed"},{status:500,headers:cors});
  const {data:agreement,error:agreementError} = await supabase.from("asas_recurring_agreements").insert({supporter_id:supporter.id,provider:"asaas",monthly_amount:amount}).select("id").single();
  if (agreementError || !agreement) return Response.json({error:"agreement_storage_failed"},{status:500,headers:cors});
  const baseUrl = environment === "production" ? "https://api.asaas.com" : "https://api-sandbox.asaas.com";
  const nextDue = new Date(); nextDue.setDate(nextDue.getDate()+1);
  const checkoutResponse = await fetch(`${baseUrl}/v3/checkouts`,{method:"POST",headers:{"Content-Type":"application/json","access_token":apiKey},body:JSON.stringify({billingTypes:["CREDIT_CARD"],chargeTypes:["RECURRENT"],minutesToExpire:60,externalReference:agreement.id,callback:{successUrl:"https://redeasas.org.br/1000-asas.html?pagamento=sucesso",cancelUrl:"https://redeasas.org.br/1000-asas.html?pagamento=cancelado",expiredUrl:"https://redeasas.org.br/1000-asas.html?pagamento=expirado"},items:[{name:"Campanha 1.000 ASAS",description:"Contribuição mensal para continuidade dos projetos sociais",quantity:1,value:amount}],customerData:{name,email,phone},subscription:{cycle:"MONTHLY",nextDueDate:`${nextDue.toISOString().slice(0,10)} 12:00:00`}})});
  const checkout = await checkoutResponse.json();
  const checkoutUrl = checkout.link || checkout.url || checkout.checkoutUrl || `https://asaas.com/checkoutSession/show?id=${encodeURIComponent(checkout.id || "")}`;
  if (!checkoutResponse.ok || !checkout.id || !checkoutUrl) { await supabase.from("asas_recurring_agreements").update({status:"falhou"}).eq("id",agreement.id); return Response.json({error:"gateway_checkout_failed"},{status:502,headers:cors}); }
  await supabase.from("asas_checkout_sessions").insert({supporter_id:supporter.id,agreement_id:agreement.id,provider:"asaas",provider_checkout_ref:checkout.id,expires_at:new Date(Date.now()+3_600_000).toISOString()});
  return Response.json({ok:true,checkout_url:checkoutUrl},{status:201,headers:{...cors,"Cache-Control":"no-store"}});
});
