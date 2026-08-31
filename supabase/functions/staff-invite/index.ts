import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const clean = (value:unknown,max:number) => typeof value === "string" ? value.trim().slice(0,max) : "";
Deno.serve(async request => {
  const origin=request.headers.get("origin")||"";
  const allowedOrigins=new Set(["https://redeasas.github.io","https://redeasas.org.br","https://www.redeasas.org.br","http://127.0.0.1:4173","http://localhost:4173","http://127.0.0.1:4199"]);
  const cors={"Access-Control-Allow-Origin":allowedOrigins.has(origin)?origin:"https://redeasas.org.br","Access-Control-Allow-Headers":"authorization, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Vary":"Origin"};
  if (request.method === "OPTIONS") return new Response(null,{status:204,headers:cors});
  if (request.method !== "POST" || !allowedOrigins.has(origin)) return Response.json({error:"method_not_allowed"},{status:405,headers:cors});
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i,"");
  if (!token) return Response.json({error:"unauthorized"},{status:401,headers:cors});
  const admin = createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false}});
  const {data:{user},error:userError} = await admin.auth.getUser(token);
  if (userError || !user) return Response.json({error:"unauthorized"},{status:401,headers:cors});
  const {data:actor} = await admin.from("asas_staff_profiles").select("role,active").eq("user_id",user.id).maybeSingle();
  if (!actor?.active || actor.role !== "admin") return Response.json({error:"forbidden"},{status:403,headers:cors});
  let body:Record<string,unknown>; try { body=await request.json(); } catch { return Response.json({error:"invalid_json"},{status:400,headers:cors}); }
  const email=clean(body.email,180).toLowerCase(), displayName=clean(body.display_name,120), role=clean(body.role,30);
  if (!email || !displayName || !["admin","financeiro","relacionamento","projetos","auditoria"].includes(role)) return Response.json({error:"invalid_fields"},{status:422,headers:cors});
  const {data:invite,error:inviteError} = await admin.auth.admin.inviteUserByEmail(email,{redirectTo:"https://redeasas.github.io/site/hub/login.html",data:{display_name:displayName}});
  if (inviteError || !invite.user) return Response.json({error:"invite_failed"},{status:409,headers:cors});
  const {error:profileError} = await admin.from("asas_staff_profiles").upsert({user_id:invite.user.id,display_name:displayName,role,active:true,updated_at:new Date().toISOString()});
  if (profileError) return Response.json({error:"profile_failed"},{status:500,headers:cors});
  return Response.json({ok:true},{status:201,headers:cors});
});
