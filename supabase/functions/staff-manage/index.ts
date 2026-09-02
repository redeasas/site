import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://redeasas.github.io",
  "https://redeasas.org.br",
  "https://www.redeasas.org.br",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);
const allowedRoles = ["admin", "financeiro", "relacionamento", "projetos", "auditoria"];
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") || "";
  const cors = {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin) ? origin : "https://redeasas.org.br",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "PATCH, OPTIONS",
    "Vary": "Origin",
  };
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "PATCH" || !allowedOrigins.has(origin)) return Response.json({ error: "method_not_allowed" }, { status: 405, headers: cors });

  const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ error: "unauthorized" }, { status: 401, headers: cors });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401, headers: cors });
  const { data: actor } = await admin.from("asas_staff_profiles").select("role,roles,active").eq("user_id", user.id).maybeSingle();
  if (!actor?.active || !(actor.roles || [actor.role]).includes("admin")) return Response.json({ error: "forbidden" }, { status: 403, headers: cors });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return Response.json({ error: "invalid_json" }, { status: 400, headers: cors }); }
  const userId = clean(body.user_id, 36);
  const roles = Array.isArray(body.roles) ? [...new Set(body.roles.map(value => clean(value, 30)))].filter(value => allowedRoles.includes(value)) : [];
  const active = body.active === true;
  if (!/^[0-9a-f-]{36}$/i.test(userId) || !roles.length) return Response.json({ error: "invalid_fields" }, { status: 422, headers: cors });
  if (userId === user.id && (!active || !roles.includes("admin"))) return Response.json({ error: "cannot_remove_own_admin_access" }, { status: 409, headers: cors });

  const { error } = await admin.from("asas_staff_profiles").update({ role: roles[0], roles, active, updated_at: new Date().toISOString() }).eq("user_id", userId);
  if (error) return Response.json({ error: "update_failed" }, { status: 500, headers: cors });
  return Response.json({ ok: true }, { status: 200, headers: { ...cors, "Cache-Control": "no-store" } });
});
