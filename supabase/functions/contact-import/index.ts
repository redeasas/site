import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://redeasas.github.io",
  "https://redeasas.org.br",
  "https://www.redeasas.org.br",
  "https://hub.redeasas.org.br",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const normalizePhone = (value: unknown) => clean(value, 60).replace(/[^0-9+]/g, "").slice(0, 24);
const normalizeEmail = (value: unknown) => {
  const email = clean(value, 254).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
};
const hash = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
};

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") || "";
  const cors = {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin) ? origin : "https://redeasas.org.br",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST" || !allowedOrigins.has(origin)) return Response.json({ error: "method_not_allowed" }, { status: 405, headers: cors });

  const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ error: "unauthorized" }, { status: 401, headers: cors });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401, headers: cors });
  const { data: actor } = await admin.from("asas_staff_profiles").select("role,roles,active").eq("user_id", user.id).maybeSingle();
  if (!actor?.active || !(actor.roles || [actor.role]).includes("admin")) return Response.json({ error: "forbidden" }, { status: 403, headers: cors });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return Response.json({ error: "invalid_json" }, { status: 400, headers: cors }); }
  const contacts = Array.isArray(body.contacts) ? body.contacts : [];
  const batchId = clean(body.batch_id, 80);
  const source = clean(body.source, 120) || "Importação VCF";
  if (!batchId || !contacts.length || contacts.length > 250) return Response.json({ error: "invalid_batch" }, { status: 422, headers: cors });

  const records = [];
  let rejected = 0;
  for (const item of contacts) {
    if (!item || typeof item !== "object") { rejected += 1; continue; }
    const row = item as Record<string, unknown>;
    const name = clean(row.name, 180);
    const phone = normalizePhone(row.phone);
    const email = normalizeEmail(row.email);
    if (!name) { rejected += 1; continue; }
    const fingerprint = await hash(`${name.toLocaleLowerCase("pt-BR")}|${phone}|${email}`);
    records.push({
      idempotency_key: `contact-import:${fingerprint}`,
      source_record_key: fingerprint,
      import_batch_id: batchId,
      import_source: source,
      form_type: "importacao_contatos",
      name,
      phone: phone || null,
      email: email || null,
      interest: "Relacionamento institucional",
      consent: false,
      page_url: "internal://asas-hub/contact-import",
      status: "novo",
      pipeline_stage: "novo_lead",
      contact_status: phone || email ? "a_contatar" : "sem_canal",
      notification_status: "dispensada",
      retention_until: new Date(Date.now() + 730 * 86400000).toISOString(),
    });
  }
  if (!records.length) return Response.json({ ok: true, inserted: 0, duplicated: 0, rejected }, { status: 200, headers: { ...cors, "Cache-Control": "no-store" } });

  const { data, error } = await admin.from("asas_leads").upsert(records, { onConflict: "idempotency_key", ignoreDuplicates: true }).select("id");
  if (error) return Response.json({ error: "import_failed" }, { status: 500, headers: cors });
  const inserted = data?.length || 0;
  await admin.from("asas_audit_log").insert({
    actor_id: user.id,
    action: "CONTACT_IMPORT_BATCH",
    entity_type: "asas_leads",
    entity_id: batchId,
    summary: { source, received: contacts.length, inserted, duplicated: records.length - inserted, rejected },
  });
  return Response.json({ ok: true, inserted, duplicated: records.length - inserted, rejected }, { status: 200, headers: { ...cors, "Cache-Control": "no-store" } });
});

