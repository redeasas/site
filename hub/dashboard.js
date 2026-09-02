(async () => {
  const auth = await window.ASAS_AUTH_READY;
  const esc = value => String(value ?? "").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const roles = auth.demo ? [] : (auth.profile.roles?.length ? auth.profile.roles : [auth.profile.role]);
  const nav = [["asas-hub.html","Dashboard",[]],["hub/mantenedores/demo.html","Mantenedores",["admin","financeiro","relacionamento","auditoria"]],["hub/financeiro.html","Financeiro",["admin","financeiro","auditoria"]],["hub/crm.html","CRM",["admin","relacionamento","auditoria"]],["hub/empresas.html","Empresas",["admin","relacionamento","auditoria"]],["hub/voluntarios.html","Voluntários",["admin","relacionamento","projetos","auditoria"]],["hub/impacto.html","Impacto",["admin","projetos","auditoria"]],["hub/ia.html","IA ASAS",["admin","relacionamento","projetos","auditoria"]],["hub/relatorios.html","Relatórios",["admin","auditoria"]],["hub/usuarios.html","Usuários",["admin"]]].filter(([, , allowed])=>auth.demo || !allowed.length || allowed.some(role=>roles.includes(role)));
  document.body.innerHTML = `<aside class="hub-sidebar"><a class="hub-brand" href="index.html"><span><img src="assets/images/logo-rede-asas-oficial.png" alt="Rede ASAS Brasil"></span></a><p>ASAS HUB<small>${auth.demo?"Ambiente demonstrativo":`Acesso ${esc(auth.profile.role)}`}</small></p><nav>${nav.map(([href,label])=>`<a${label==="Dashboard"?' class="active"':""} href="${href}">${label}</a>`).join("")}</nav><a class="hub-back" href="index.html">← Voltar ao site</a></aside><main class="hub-main"><div class="hub-demo">${auth.demo?"Demonstração · sem dados reais":"Ambiente protegido · indicadores calculados da base operacional"}</div><header><div><p>Visão geral</p><h1>Olá, ${auth.demo?"equipe Rede ASAS":esc(auth.profile.display_name)}</h1><span>${auth.demo?"Validação visual local.":"Dados sujeitos às permissões do seu perfil."}</span></div><button aria-label="Perfil autenticado">AS</button></header><section class="hub-kpis" data-dashboard-kpis><article><small>Carregando</small><strong>—</strong><span>Aguarde</span></article></section><section class="hub-grid"><article class="hub-panel"><p>Campanha 1.000 ASAS</p><small data-campaign-note>Somente mantenedores ativos e conciliados.</small><div class="hub-donut"><b data-campaign-total>—<br>ATIVAS</b></div></article><article class="hub-panel"><p>Contatos por origem</p><div data-lead-origins><p class="hub-empty">Carregando…</p></div></article><article class="hub-panel"><p>Controles críticos</p><dl data-controls></dl></article></section><section class="hub-lists"><article><h2>Atividade recente</h2><div data-recent><p class="hub-empty">Carregando conforme permissão…</p></div></article><article><h2>Próximas ações</h2><div data-actions><p class="hub-empty">Carregando…</p></div></article></section><footer><strong>${auth.demo?"Validação local":"Dados operacionais reais"}</strong><span>Valores financeiros permanecem zerados até gateway e conciliação.</span></footer></main>`;
  if (auth.demo) {
    document.querySelector("[data-dashboard-kpis]").innerHTML = [["1.000 ASAS","— / 1.000","Demonstração"],["Receita confirmada","R$ —","Gateway desativado"],["Contatos","—","Sem dados locais"],["Ações vencidas","—","Sem agenda"]].map(x=>`<article><small>${x[0]}</small><strong>${x[1]}</strong><span>${x[2]}</span></article>`).join("");
    document.querySelector("[data-lead-origins]").innerHTML = '<p class="hub-empty">Sem dados no modo local.</p>';
    document.querySelector("[data-controls]").innerHTML = '<div><dt>Gateway</dt><dd>Desativado</dd></div>';
    document.querySelector("[data-recent]").innerHTML = '<p class="hub-empty">A auditoria real exige autenticação.</p>';
    document.querySelector("[data-actions]").innerHTML = '<p class="hub-empty">Nenhuma agenda demonstrativa.</p>';
    return;
  }
  const token = window.ASAS_AUTH.readSession().access_token;
  const get = path => window.ASAS_AUTH.request(path,{},token);
  const [supportersRes,paymentsRes,leadsRes,actionsRes,impactRes,auditRes] = await Promise.all([
    get("/rest/v1/asas_supporters?select=id,status&limit=1000"),
    get("/rest/v1/asas_payment_events?select=amount,status,event_type&status=eq.confirmado&limit=1000"),
    get("/rest/v1/asas_leads?select=id,form_type,status,created_at&limit=1000"),
    get(`/rest/v1/asas_leads?select=id,name,next_action_at,pipeline_stage&next_action_at=not.is.null&order=next_action_at.asc&limit=8`),
    get("/rest/v1/asas_impact_indicators?select=id,status&limit=1000"),
    get("/rest/v1/asas_audit_log?select=occurred_at,action,entity_type&order=occurred_at.desc&limit=8")
  ]);
  const json = async response => response.ok ? response.json() : [];
  const [supporters,payments,leads,actions,impact,audit] = await Promise.all([supportersRes,paymentsRes,leadsRes,actionsRes,impactRes,auditRes].map(json));
  const active = supporters.filter(x=>x.status==="ativo").length;
  const revenue = payments.reduce((sum,x)=>sum+Number(x.amount||0),0);
  const pending = leads.filter(x=>!["concluido","spam"].includes(x.status)).length;
  const overdue = actions.filter(x=>new Date(x.next_action_at)<new Date()).length;
  document.querySelector("[data-dashboard-kpis]").innerHTML = [["1.000 ASAS",`${active} / 1.000`,"Mantenedores ativos"],["Receita confirmada",revenue.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),"Eventos conciliados"],["Contatos pendentes",pending,"CRM protegido"],["Ações vencidas",overdue,"Requer acompanhamento"]].map(x=>`<article><small>${x[0]}</small><strong>${x[1]}</strong><span>${x[2]}</span></article>`).join("");
  document.querySelector("[data-campaign-total]").innerHTML = `${active}<br>ATIVAS`;
  const origins = Object.entries(leads.reduce((acc,x)=>(acc[x.form_type]=(acc[x.form_type]||0)+1,acc),{})).sort((a,b)=>b[1]-a[1]);
  document.querySelector("[data-lead-origins]").innerHTML = origins.length?`<dl>${origins.slice(0,6).map(([name,count])=>`<div><dt>${esc(name)}</dt><dd>${count}</dd></div>`).join("")}</dl>`:'<p class="hub-empty">Nenhum contato recebido.</p>';
  document.querySelector("[data-controls]").innerHTML = `<div><dt>Impactos aprovados/publicados</dt><dd>${impact.filter(x=>["aprovado","publicado"].includes(x.status)).length}</dd></div><div><dt>Impactos em validação</dt><dd>${impact.filter(x=>x.status==="em_validacao").length}</dd></div><div><dt>Gateway</dt><dd>Desativado</dd></div>`;
  document.querySelector("[data-actions]").innerHTML = actions.length?`<ul>${actions.map(x=>`<li><strong>${esc(x.name)}</strong> · ${new Date(x.next_action_at).toLocaleDateString("pt-BR")} · ${esc(x.pipeline_stage.replaceAll("_"," "))}</li>`).join("")}</ul>`:'<p class="hub-empty">Nenhuma próxima ação agendada.</p>';
  document.querySelector("[data-recent]").innerHTML = audit.length?`<ul>${audit.map(x=>`<li>${new Date(x.occurred_at).toLocaleString("pt-BR")} · ${esc(x.action)} · ${esc(x.entity_type)}</li>`).join("")}</ul>`:'<p class="hub-empty">Sem acesso à auditoria ou nenhuma atividade registrada.</p>';
})();
