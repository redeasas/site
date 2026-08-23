import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://redeasas.github.io",
  "https://redeasas.org.br",
  "https://www.redeasas.org.br",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const hash = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const escapeHtml = (value: unknown) => text(value, 4000)
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

const scoreCompanyLead = (payload: Record<string, unknown>) => {
  let score = 0;
  if (text(payload.empresa, 180)) score += 10;
  if (text(payload.email, 180) && !/@(gmail|hotmail|outlook|yahoo)\./i.test(text(payload.email, 180))) score += 10;
  if (text(payload.cnpj, 30)) score += 10;
  if (/diretor|presidente|sócio|socio|ceo|gerente|coordenador|rh|esg|sustentabilidade/i.test(text(payload.cargo, 100))) score += 15;
  if (text(payload.faixa_apoio, 100) && !/prefiro/i.test(text(payload.faixa_apoio, 100))) score += 15;
  if (text(payload.projeto, 180)) score += 10;
  if (/imediato|30 dias|90 dias/i.test(text(payload.prazo, 80))) score += 15;
  if (/reunião|reuniao|conversa|proposta/i.test(text(payload.mensagem, 4000))) score += 15;
  const classification = score >= 81 ? "prioridade" : score >= 61 ? "oportunidade" : score >= 31 ? "qualificado" : "novo";
  return { score: Math.min(score, 100), classification };
};

const notifyTeam = async (record: Record<string, unknown>, leadId: string) => {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const to = Deno.env.get("LEAD_NOTIFICATION_TO");
  if (!apiKey || !to) return { status: "pendente", error: "notification_not_configured" };
  const from = Deno.env.get("LEAD_NOTIFICATION_FROM") || "Rede ASAS Brasil <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `asas-lead-${leadId}` },
    body: JSON.stringify({
      from, to: [to], reply_to: record.email || undefined,
      subject: `Novo contato pelo site — ${text(record.form_type, 80)}`,
      html: `<h2>Novo contato recebido pelo site</h2>
        <p><strong>Nome:</strong> ${escapeHtml(record.name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(record.email) || "Não informado"}</p>
        <p><strong>Telefone:</strong> ${escapeHtml(record.phone) || "Não informado"}</p>
        <p><strong>Assunto:</strong> ${escapeHtml(record.interest || record.form_type)}</p>
        <p><strong>Organização:</strong> ${escapeHtml(record.organization) || "Não informada"}</p>
        <p><strong>Mensagem:</strong><br>${escapeHtml(record.message).replaceAll("\n", "<br>") || "Não informada"}</p>
        <hr><p>Registro ${escapeHtml(leadId)}. Acesse o projeto Rede ASAS Brasil no Supabase para acompanhar o atendimento.</p>`,
    }),
  });
  if (response.ok) return { status: "enviada", error: null };
  return { status: "falhou", error: `resend_${response.status}` };
};

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") || "";
  const cors = {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin) ? origin : "https://redeasas.org.br",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST" || !allowedOrigins.has(origin)) return Response.json({ error: "not_allowed" }, { status: 403, headers: cors });
  if (!request.headers.get("content-type")?.includes("application/json")) return Response.json({ error: "invalid_content_type" }, { status: 415, headers: cors });

  let payload: Record<string, unknown>;
  try { payload = await request.json(); }
  catch { return Response.json({ error: "invalid_json" }, { status: 400, headers: cors }); }

  if (text(payload.website, 10)) return Response.json({ ok: true }, { status: 202, headers: cors });
  const startedAt = Number(payload.started_at || 0);
  const submittedAt = Number(payload.submitted_at || 0);
  if (!startedAt || !submittedAt || submittedAt - startedAt < 2500 || submittedAt - startedAt > 86_400_000) {
    return Response.json({ error: "invalid_submission_time" }, { status: 400, headers: cors });
  }

  const name = text(payload.nome, 120);
  const email = text(payload.email, 180).toLowerCase();
  const phone = text(payload.telefone, 40);
  const consent = [true, "true", "on", "sim"].includes(payload.consentimento as never);
  if (!name || (!email && !phone) || !consent) return Response.json({ error: "missing_required_fields" }, { status: 422, headers: cors });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "invalid_email" }, { status: 422, headers: cors });

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = await hash(`${forwarded}:${Deno.env.get("LEAD_HASH_SALT") || "asas"}`);
  const windowStart = new Date(Math.floor(Date.now() / 3_600_000) * 3_600_000).toISOString();
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data: rate } = await supabase.from("asas_lead_rate_limits").select("request_count").eq("ip_hash", ipHash).eq("window_start", windowStart).maybeSingle();
  if ((rate?.request_count || 0) >= 8) return Response.json({ error: "rate_limited" }, { status: 429, headers: { ...cors, "Retry-After": "3600" } });
  await supabase.from("asas_lead_rate_limits").upsert({ ip_hash: ipHash, window_start: windowStart, request_count: (rate?.request_count || 0) + 1 });

  const preferences = Array.isArray(payload.preferencias)
    ? payload.preferencias.map((item) => text(item, 100)).filter(Boolean).slice(0, 10)
    : text(payload.preferencias, 100) ? [text(payload.preferencias, 100)] : [];
  const qualification = scoreCompanyLead(payload);
  const protocol = `ASAS-${new Date().toISOString().slice(0,10).replaceAll("-", "")}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
  const record = {
    idempotency_key: text(payload.idempotency_key, 100),
    form_type: text(payload.form_type, 80) || "contato",
    name,
    email: email || null,
    phone: phone || null,
    interest: text(payload.interesse, 180) || null,
    organization: text(payload.empresa || payload.cnpj, 180) || null,
    company_cnpj: text(payload.cnpj, 30) || null,
    company_role: text(payload.cargo, 120) || null,
    company_city: text(payload.cidade, 120) || null,
    company_state: text(payload.estado, 2).toUpperCase() || null,
    company_segment: text(payload.segmento, 160) || null,
    company_size: text(payload.colaboradores, 30) || null,
    cause_interest: text(payload.area_interesse, 180) || null,
    support_type: text(payload.interesse, 180) || null,
    investment_range: text(payload.faixa_apoio, 100) || null,
    decision_deadline: text(payload.prazo, 80) || null,
    project_interest: text(payload.projeto, 180) || null,
    lead_score: qualification.score,
    lead_classification: qualification.classification,
    pipeline_stage: "novo_lead",
    protocol,
    message: text(payload.mensagem, 4000) || null,
    preferences,
    consent: true,
    consent_at: new Date().toISOString(),
    page_url: text(payload.page_url, 1000),
    referrer: text(payload.referrer, 1000) || null,
    utm_source: text(payload.utm_source, 180) || null,
    utm_medium: text(payload.utm_medium, 180) || null,
    utm_campaign: text(payload.utm_campaign, 180) || null,
    utm_content: text(payload.utm_content, 180) || null,
    utm_term: text(payload.utm_term, 180) || null,
    user_agent: text(request.headers.get("user-agent"), 500) || null,
    ip_hash: ipHash,
  };
  if (!record.idempotency_key || !record.page_url) return Response.json({ error: "invalid_metadata" }, { status: 422, headers: cors });
  const { data: inserted, error } = await supabase.from("asas_leads").insert(record).select("id").single();
  if (error?.code === "23505") return Response.json({ ok: true, duplicate: true }, { status: 200, headers: cors });
  if (error) return Response.json({ error: "storage_failed" }, { status: 500, headers: cors });
  if (record.form_type === "integration_test" && inserted?.id) {
    await supabase.from("asas_leads").delete().eq("id", inserted.id);
  } else if (inserted?.id) {
    try {
      const notification = await notifyTeam(record, inserted.id);
      await supabase.from("asas_leads").update({ notification_status: notification.status, notification_error: notification.error }).eq("id", inserted.id);
    } catch {
      await supabase.from("asas_leads").update({ notification_status: "falhou", notification_error: "unexpected_notification_error" }).eq("id", inserted.id);
    }
  }
  return Response.json({ ok: true, protocol }, { status: 201, headers: { ...cors, "Cache-Control": "no-store" } });
});
