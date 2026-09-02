(async () => {
  const authContext = await window.ASAS_AUTH_READY;
  const view = document.body.dataset.hubView || "crm";
  const labels = { mantenedor:"Ficha 360°", crm:"CRM", financeiro:"Financeiro", empresas:"Empresas", voluntarios:"Voluntários", impacto:"Impacto", ia:"IA ASAS", relatorios:"Relatórios e auditoria", usuarios:"Usuários e permissões" };
  const activeNav = { mantenedor:"Mantenedores", relatorios:"Relatórios", usuarios:"Usuários" }[view] || labels[view];
  const prefix = view === "mantenedor" ? "../../" : "../";
  const navigation = [["../asas-hub.html","Dashboard",[]],["mantenedores/demo.html","Mantenedores",["admin","financeiro","relacionamento","auditoria"]],["financeiro.html","Financeiro",["admin","financeiro","auditoria"]],["crm.html","CRM",["admin","relacionamento","auditoria"]],["empresas.html","Empresas",["admin","relacionamento","auditoria"]],["voluntarios.html","Voluntários",["admin","relacionamento","projetos","auditoria"]],["impacto.html","Impacto",["admin","projetos","auditoria"]],["ia.html","IA ASAS",["admin","relacionamento","projetos","auditoria"]],["relatorios.html","Relatórios",["admin","auditoria"]],["usuarios.html","Usuários",["admin"]]];
  const cards = (items) => `<section class="hub-kpis">${items.map(([a,b,c])=>`<article><small>${a}</small><strong>${b}</strong><span>${c}</span></article>`).join("")}</section>`;
  const emptyRows = (columns, rows=5) => `<div class="hub-table" role="table"><div class="hub-tr hub-th">${columns.map(x=>`<span>${x}</span>`).join("")}</div>${Array.from({length:rows},(_,i)=>`<div class="hub-tr"><span>Registro fictício ${i+1}</span>${columns.slice(1).map(()=>`<span>—</span>`).join("")}</div>`).join("")}</div>`;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const profileRoles = authContext.demo ? [] : (authContext.profile.roles?.length ? authContext.profile.roles : [authContext.profile.role]);
  const hasRole = roles => roles.some(role => profileRoles.includes(role));
  const screens = {
    mantenedor: `<div class="hub-profile"><div class="hub-avatar">EX</div><div><small>Mantenedor demonstrativo</small><h2>Pessoa Exemplo</h2><p>ASA #DEMO · Contato protegido · Belo Horizonte/MG</p></div><span class="hub-status">ATIVO — MOCK</span></div>${cards([["Contribuição mensal","R$ —","Gateway não conectado"],["Total contribuído","R$ —","Sem conciliação"],["Indicações","—","Sem dados reais"],["Origem","Demonstração","Não rastreada"]])}<div class="hub-tabs"><button class="active">Resumo</button><button>Pagamentos</button><button>Relacionamento</button><button>Indicações</button><button>Dados pessoais</button><button>Documentos</button></div><section class="hub-two"><article class="hub-panel"><h2>Histórico de pagamentos</h2>${emptyRows(["Competência","Valor","Status","Método"],4)}</article><article class="hub-panel"><h2>Resumo do relacionamento</h2><p class="hub-empty">Nenhuma interação real. Quando o backend estiver ativo, alterações sensíveis gerarão trilha de auditoria.</p><h3>Notas da equipe</h3><p>Campo demonstrativo com acesso condicionado ao perfil autorizado.</p></article></section>`,
    crm: `<div class="hub-toolbar"><input data-hub-search placeholder="Buscar contatos autorizados…"><button disabled>Filtros</button><button disabled>+ Novo lead</button></div><p class="hub-note">Dados reais protegidos por sessão, perfil de acesso e trilha de auditoria. Exibição limitada ao necessário para triagem.</p><div class="hub-kanban" data-kanban><p class="hub-empty">Carregando contatos com segurança…</p></div>`,
    financeiro: `${cards([["Receita total","R$ —","Sem gateway"],["Receita recorrente","R$ —","Sem webhook"],["Doações pontuais","R$ —","Não conciliado"],["Pendências","—","Sem dados reais"]])}<section class="hub-two"><article class="hub-panel"><h2>Evolução da receita</h2><div class="hub-chart-empty">Gráfico aguardando integração financeira</div></article><article class="hub-panel"><h2>Origem da receita</h2><div class="hub-donut"><b>SEM<br>DADOS</b></div></article></section><article class="hub-panel"><h2>Movimentações</h2>${emptyRows(["Data","Descrição","Categoria","Valor","Status"],5)}<p class="hub-note">Contrato previsto: eventos idempotentes do gateway por webhook; nenhum dado completo de cartão será armazenado.</p></article>`,
    empresas: `${cards([["Leads","—","Demonstração"],["Em negociação","—","Demonstração"],["Parceiros","—","Demonstração"],["Inativos","—","Demonstração"]])}<article class="hub-panel"><h2>Gestão de parcerias</h2>${emptyRows(["Empresa","Contato","Interesse","Status","Responsável","Próxima ação"],6)}</article>`,
    voluntarios: `${cards([["Novos","—","Sem dados pessoais"],["Entrevista","—","Sem agenda"],["Ativos","—","Sem validação"],["Pausados","—","Demonstração"]])}<article class="hub-panel"><h2>Cadastros de voluntariado</h2>${emptyRows(["Nome","Área","Disponibilidade","Status","Projeto","Último contato"],6)}<p class="hub-note">LGPD: coletar somente dados necessários, consentimento e documentos aplicáveis ao projeto.</p></article>`,
    impacto: `${cards([["Crianças atendidas","—","Em validação"],["Famílias atendidas","—","Em validação"],["Atividades","—","Em validação"],["Atendimentos","—","Em validação"]])}<section class="hub-two"><article class="hub-panel"><h2>Indicadores</h2>${emptyRows(["Indicador","Período","Fonte","Responsável","Status"],4)}</article><article class="hub-panel"><h2>O que suas ASAS fizeram este mês</h2><p class="hub-empty">Conteúdo ainda não publicado. Somente indicadores com status APROVADO ou PUBLICADO poderão alimentar o site e Minha ASA.</p><div class="hub-workflow"><span>Rascunho</span><i>→</i><span>Em validação</span><i>→</i><span>Aprovado</span><i>→</i><span>Publicado</span></div></article></section>`,
    ia: `<div class="hub-toolbar"><input data-hub-search placeholder="Buscar conteúdo aprovado…"><button data-test-ia>Testar IA</button><button disabled>+ Novo conteúdo</button></div><section class="hub-two"><aside class="hub-panel"><h2>Categorias</h2><ul class="hub-categories">${["Institucional","História","Projetos","Creche","Impacto","Transparência","1.000 ASAS","Doações","Voluntariado","Empresas","Novo prédio","Contatos"].map(x=>`<li>${x}</li>`).join("")}</ul></aside><article class="hub-panel"><h2>Base de conhecimento</h2>${emptyRows(["Título","Categoria","Status","Fonte"],6)}<p class="hub-note">A IA pública só poderá consultar conteúdos com status PUBLICADO e fonte aprovada.</p></article></section>`,
    relatorios: `<article class="hub-panel" data-report-content><p class="hub-empty">Carregando relatórios conforme sua permissão…</p></article>`,
    usuarios: `<article class="hub-panel" data-user-content><p class="hub-empty">Carregando usuários autorizados…</p></article>`
  };
  const visibleNavigation = authContext.demo ? navigation : navigation.filter(([, , roles]) => !roles.length || hasRole(roles));
  document.body.innerHTML = `<aside class="hub-sidebar"><a class="hub-brand" href="${prefix}index.html"><span><img src="${prefix}assets/images/logo-rede-asas-oficial.png" alt="Rede ASAS Brasil"></span></a><p>ASAS HUB<small>${authContext.demo ? "Ambiente demonstrativo" : `Acesso ${escapeHtml(profileRoles.join(", "))}`}</small></p><nav>${visibleNavigation.map(([href,label])=>`<a${label===activeNav?' class="active"':''} href="${view==='mantenedor'?'../':''}${href}">${label}</a>`).join("")}</nav><a class="hub-back" href="${prefix}index.html">← Voltar ao site</a></aside><main class="hub-main"><div class="hub-demo">${authContext.demo ? "Demonstração · sem dados pessoais, financeiros ou operacionais reais" : "Ambiente protegido · dados sujeitos a permissão, finalidade e auditoria"}</div><header><div><p>ASAS HUB / ${labels[view]}</p><h1>${labels[view]}</h1><span>${authContext.demo ? "Protótipo funcional para validação de arquitetura e fluxo." : `Sessão de ${escapeHtml(authContext.profile.display_name)}.`}</span></div><button aria-label="Perfil autenticado">AS</button></header>${screens[view]}<footer><strong>Controle de acesso ativo</strong><span>Administrador · Financeiro · Relacionamento · Projetos · Leitura/Auditoria</span></footer></main>`;
  document.querySelector("[data-hub-search]")?.addEventListener("input",e=>{const term=e.target.value.toLowerCase();document.querySelectorAll("[data-card],.hub-tr:not(.hub-th)").forEach(x=>x.hidden=!x.textContent.toLowerCase().includes(term));});
  document.querySelectorAll("[data-stage]").forEach(select=>select.addEventListener("change",()=>{select.closest("[data-card]").dataset.pendingMove="true"; select.insertAdjacentHTML("afterend",'<small class="hub-warning">Alteração apenas visual; não foi salva.</small>');}));
  document.querySelector("[data-test-ia]")?.addEventListener("click",()=>alert("Modo de teste: nenhuma pergunta ou resposta será publicada."));
  if (authContext.demo && view === "relatorios") document.querySelector("[data-report-content]").innerHTML = '<h2>Trilha de auditoria</h2><p class="hub-empty">A visualização real exige sessão com perfil Administrador ou Leitura/Auditoria.</p>';
  if (authContext.demo && view === "usuarios") document.querySelector("[data-user-content]").innerHTML = '<h2>Equipe autorizada</h2><p class="hub-empty">Convites e permissões reais exigem sessão de Administrador.</p>';

  if (view === "crm" && !authContext.demo) {
    const token = window.ASAS_AUTH.readSession().access_token;
    const stages = [
      ["Novo lead", ["novo_lead"]], ["Qualificação", ["qualificacao","diagnostico"]],
      ["Contato realizado", ["contato_realizado"]], ["Negociação", ["reuniao","proposta","negociacao"]],
      ["Parceria", ["parceria","execucao","relatorio","renovacao","pos_parceria"]]
    ];
    const fields = "id,created_at,form_type,name,interest,organization,project_interest,support_type,monthly_amount_interest,pipeline_stage,assigned_to,last_contacted_at,next_action_at,interaction_note";
    const response = await window.ASAS_AUTH.request(`/rest/v1/asas_leads?select=${fields}&order=created_at.desc&limit=200`, {}, token);
    const kanban = document.querySelector("[data-kanban]");
    if (!response.ok) kanban.innerHTML = '<p class="hub-empty">Não foi possível carregar os contatos. Verifique o perfil de acesso ou tente novamente.</p>';
    else {
      const leads = await response.json();
      const stageOptions = stages.flatMap(([,values])=>values).map(value=>`<option value="${value}">${value.replaceAll("_"," ")}</option>`).join("");
      const card = lead => `<article data-card data-lead-id="${escapeHtml(lead.id)}"><strong>${escapeHtml(lead.name)}</strong><small>${escapeHtml(lead.organization || lead.form_type)}</small><p>Interesse: ${escapeHtml(lead.project_interest || lead.interest || lead.support_type || "não classificado")}<br>Origem: ${escapeHtml(lead.form_type)}<br>Recebido: ${new Date(lead.created_at).toLocaleDateString("pt-BR")}</p>${lead.monthly_amount_interest ? `<b>Interesse mensal: ${escapeHtml(lead.monthly_amount_interest)}</b>` : ""}<label>Etapa<select data-lead-stage>${stageOptions}</select></label><label>Responsável<input data-lead-owner maxlength="100" value="${escapeHtml(lead.assigned_to || "")}" placeholder="Nome da pessoa responsável"></label><label>Próxima ação<input data-lead-next type="date" value="${lead.next_action_at ? lead.next_action_at.slice(0,10) : ""}"></label><label>Nota breve<textarea data-lead-note maxlength="500" placeholder="Sem dados sensíveis">${escapeHtml(lead.interaction_note || "")}</textarea></label><button type="button" data-save-lead>Salvar acompanhamento</button><span class="hub-save-status" aria-live="polite"></span></article>`;
      kanban.innerHTML = stages.map(([label,values]) => { const matches = leads.filter(lead => values.includes(lead.pipeline_stage)); return `<section><h2>${label}<span>${matches.length}</span></h2>${matches.length ? matches.map(card).join("") : '<p class="hub-empty">Sem contatos</p>'}</section>`; }).join("");
      leads.forEach(lead => { const select = kanban.querySelector(`[data-lead-id="${CSS.escape(lead.id)}"] [data-lead-stage]`); if (select) select.value = lead.pipeline_stage; });
      kanban.addEventListener("click", async event => {
        const button = event.target.closest("[data-save-lead]");
        if (!button) return;
        const leadCard = button.closest("[data-lead-id]");
        const status = leadCard.querySelector(".hub-save-status");
        button.disabled = true;
        status.textContent = "Salvando…";
        const nextDate = leadCard.querySelector("[data-lead-next]").value;
        const payload = {
          pipeline_stage: leadCard.querySelector("[data-lead-stage]").value,
          assigned_to: leadCard.querySelector("[data-lead-owner]").value.trim() || null,
          next_action_at: nextDate ? `${nextDate}T12:00:00-03:00` : null,
          interaction_note: leadCard.querySelector("[data-lead-note]").value.trim() || null,
          last_contacted_at: new Date().toISOString(),
          status: "em_atendimento"
        };
        const saved = await window.ASAS_AUTH.request(`/rest/v1/asas_leads?id=eq.${encodeURIComponent(leadCard.dataset.leadId)}`, { method:"PATCH", headers:{ Prefer:"return=minimal" }, body:JSON.stringify(payload) }, token);
        if (saved.ok) location.reload();
        else { status.textContent = "Não foi possível salvar. Verifique sua permissão."; button.disabled = false; }
      });
    }
  }

  if (!authContext.demo && ["mantenedor","financeiro","empresas","voluntarios","impacto","ia"].includes(view)) {
    const modules = {
      mantenedor: { table:"asas_supporters", select:"full_name,asa_number,status,source,joined_at,monthly_amount", order:"created_at.desc", columns:["Nome","ASA","Status","Origem","Entrada","Valor mensal"], values:r=>[r.full_name,r.asa_number||"—",r.status,r.source||"—",r.joined_at||"—",r.monthly_amount == null?"—":Number(r.monthly_amount).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})] },
      financeiro: { table:"asas_payment_events", select:"occurred_at,event_type,status,amount,gateway_reference", order:"occurred_at.desc", columns:["Data","Evento","Status","Valor","Referência","Origem"], values:r=>[new Date(r.occurred_at).toLocaleDateString("pt-BR"),r.event_type,r.status,r.amount==null?"—":Number(r.amount).toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),r.gateway_reference||"—","Gateway"] },
      empresas: { table:"asas_organizations", select:"name,contact_name,interest,stage,next_action_at,updated_at", order:"updated_at.desc", columns:["Empresa","Contato","Interesse","Etapa","Próxima ação","Atualização"], values:r=>[r.name,r.contact_name||"—",r.interest||"—",r.stage,r.next_action_at?new Date(r.next_action_at).toLocaleDateString("pt-BR"):"—",new Date(r.updated_at).toLocaleDateString("pt-BR")] },
      voluntarios: { table:"asas_volunteers", select:"full_name,profession,availability,status,project_interest,updated_at", order:"updated_at.desc", columns:["Nome","Profissão","Disponibilidade","Status","Projeto","Atualização"], values:r=>[r.full_name,r.profession||"—",r.availability||"—",r.status,r.project_interest||"—",new Date(r.updated_at).toLocaleDateString("pt-BR")] },
      impacto: { table:"asas_impact_indicators", select:"id,name,project,period_start,period_end,source,status", order:"period_end.desc", columns:["Indicador","Projeto","Início","Fim","Fonte","Status"], values:r=>[r.name,r.project,r.period_start,r.period_end,r.source,r.status] },
      ia: { table:"asas_knowledge_entries", select:"id,title,category,status,source,updated_at,reviewed_at", order:"updated_at.desc", columns:["Título","Categoria","Status","Fonte","Atualização","Revisão"], values:r=>[r.title,r.category,r.status,r.source,new Date(r.updated_at).toLocaleDateString("pt-BR"),r.reviewed_at?new Date(r.reviewed_at).toLocaleDateString("pt-BR"):"—"] }
    };
    const module = modules[view];
    const token = window.ASAS_AUTH.readSession().access_token;
    const formConfigs = {
      mantenedor: { roles:["admin","financeiro","relacionamento"], title:"Novo mantenedor", fields:[
        ["full_name","Nome completo","text",true], ["email","E-mail","email",false], ["phone","Telefone","tel",false],
        ["city","Cidade","text",false], ["state","UF","text",false], ["source","Fonte documental/origem","text",true],
        ["joined_at","Data de entrada","date",false], ["monthly_amount","Valor mensal","number",false],
        ["consent","Confirmo que existe consentimento ou base legal documentada","checkbox",true]
      ], transform:data=>({...data, state:data.state?.toUpperCase() || null, monthly_amount:data.monthly_amount?Number(data.monthly_amount):null, consent_at:data.consent?new Date().toISOString():null, consent:undefined, owner_id:authContext.user.id}) },
      empresas: { roles:["admin","relacionamento"], title:"Nova empresa", fields:[
        ["name","Nome da empresa","text",true], ["legal_name","Razão social","text",false], ["cnpj","CNPJ","text",false],
        ["contact_name","Contato responsável","text",false], ["email","E-mail","email",false], ["phone","Telefone","tel",false],
        ["segment","Segmento","text",false], ["interest","Interesse","text",true], ["next_action_at","Próxima ação","date",false]
      ], transform:data=>({...data, next_action_at:data.next_action_at?`${data.next_action_at}T12:00:00-03:00`:null, owner_id:authContext.user.id}) },
      voluntarios: { roles:["admin","relacionamento","projetos"], title:"Novo voluntário", fields:[
        ["full_name","Nome completo","text",true], ["email","E-mail","email",false], ["phone","Telefone","tel",false],
        ["profession","Profissão","text",false], ["skills","Habilidades (separadas por vírgula)","text",false],
        ["availability","Disponibilidade","text",true], ["project_interest","Projeto de interesse","text",false],
        ["consent","Confirmo que existe consentimento documentado","checkbox",true]
      ], transform:data=>({...data, skills:data.skills?data.skills.split(",").map(x=>x.trim()).filter(Boolean):[], consent_at:data.consent?new Date().toISOString():null, consent:undefined}) },
      impacto: { roles:["admin","projetos"], title:"Novo indicador", fields:[
        ["project","Projeto","text",true], ["name","Indicador","text",true], ["numeric_value","Valor numérico","number",false],
        ["text_value","Valor textual","text",false], ["period_start","Início do período","date",true], ["period_end","Fim do período","date",true],
        ["source","Fonte documental","text",true], ["methodology","Metodologia","textarea",true]
      ], transform:data=>({...data, numeric_value:data.numeric_value?Number(data.numeric_value):null, owner_id:authContext.user.id}) },
      ia: { roles:["admin","relacionamento","projetos"], title:"Novo conteúdo interno", fields:[
        ["title","Título","text",true], ["category","Categoria","text",true], ["content","Conteúdo","textarea",true], ["source","Fonte documental","text",true]
      ], transform:data=>({...data, owner_id:authContext.user.id}) }
    };
    const formConfig = formConfigs[view];
    const canCreate = formConfig && hasRole(formConfig.roles);
    const response = await window.ASAS_AUTH.request(`/rest/v1/${module.table}?select=${module.select}&order=${module.order}&limit=200`, {}, token);
    const footer = document.querySelector(".hub-main > footer");
    document.querySelectorAll(".hub-main > header ~ section,.hub-main > header ~ article,.hub-main > header ~ .hub-profile,.hub-main > header ~ .hub-tabs").forEach(item => item.remove());
    if (!response.ok) footer?.insertAdjacentHTML("beforebegin", '<article class="hub-panel"><p class="hub-empty">Não foi possível carregar este módulo para o perfil atual.</p></article>');
    else {
      const rows = await response.json();
      const table = rows.length ? `<div class="hub-table" role="table"><div class="hub-tr hub-th">${module.columns.map(escapeHtml).map(x=>`<span>${x}</span>`).join("")}</div>${rows.map(row=>`<div class="hub-tr">${module.values(row).map(escapeHtml).map(x=>`<span>${x}</span>`).join("")}</div>`).join("")}</div>` : '<p class="hub-empty">Nenhum registro validado neste módulo.</p>';
      const toolbar = canCreate ? `<div class="hub-toolbar"><button type="button" data-open-create>+ ${escapeHtml(formConfig.title)}</button></div>` : "";
      footer?.insertAdjacentHTML("beforebegin", `${toolbar}<article class="hub-panel"><h2>${labels[view]}</h2>${table}<p class="hub-note">Consulta limitada aos 200 registros mais recentes e protegida pelas permissões do seu perfil.</p></article>`);
      if (["impacto","ia"].includes(view) && rows.length) {
        const isAdmin = hasRole(["admin"]);
        const allowedToSubmit = view === "impacto" ? hasRole(["admin","projetos"]) : hasRole(["admin","relacionamento","projetos"]);
        const actionFor = row => {
          if (row.status === "rascunho" && allowedToSubmit) return ["em_validacao","Enviar para validação"];
          if (row.status === "em_validacao" && isAdmin) return ["aprovado","Aprovar"];
          if (row.status === "aprovado" && isAdmin) return ["publicado","Publicar"];
          return null;
        };
        const workflowRows = rows.map(row => {
          const action = actionFor(row);
          const title = view === "impacto" ? row.name : row.title;
          return `<div class="hub-tr"><span>${escapeHtml(title)}</span><span>${escapeHtml(row.status.replaceAll("_"," "))}</span><span>${action ? `<button type="button" data-workflow-id="${escapeHtml(row.id)}" data-workflow-target="${action[0]}">${action[1]}</button>` : "Aguardando etapa ou permissão"}</span></div>`;
        }).join("");
        footer?.insertAdjacentHTML("beforebegin", `<article class="hub-panel" data-workflow-panel><h2>Fluxo de validação e publicação</h2><p class="hub-note">Rascunhos nunca aparecem no site público. Aprovação e publicação exigem perfil Administrador e ficam registradas na auditoria.</p><div class="hub-table"><div class="hub-tr hub-th"><span>Registro</span><span>Etapa atual</span><span>Ação permitida</span></div>${workflowRows}</div><p class="hub-form-status" data-workflow-status aria-live="polite"></p></article>`);
        document.querySelector("[data-workflow-panel]")?.addEventListener("click", async event => {
          const button = event.target.closest("[data-workflow-id]");
          if (!button) return;
          const status = document.querySelector("[data-workflow-status]");
          const verb = button.textContent.trim().toLowerCase();
          if (!confirm(`Confirma ${verb} este registro? A ação será auditada.`)) return;
          button.disabled = true; status.textContent = "Registrando transição…";
          const rpc = view === "impacto" ? "asas_transition_impact" : "asas_transition_knowledge";
          const transitioned = await window.ASAS_AUTH.request(`/rest/v1/rpc/${rpc}`, { method:"POST", body:JSON.stringify({ p_record_id:button.dataset.workflowId, p_target_status:button.dataset.workflowTarget }) }, token);
          if (transitioned.ok) location.reload();
          else { status.textContent = "A transição não foi autorizada. Verifique a etapa e seu perfil."; button.disabled = false; }
        });
      }
      if (canCreate) {
        const fields = formConfig.fields.map(([name,label,type,required]) => `<label>${escapeHtml(label)}${type === "textarea" ? `<textarea name="${name}" ${required?"required":""}></textarea>` : type === "checkbox" ? `<input name="${name}" type="checkbox" ${required?"required":""}>` : `<input name="${name}" type="${type}" ${type==="number"?'min="0" step="0.01"':""} ${name==="state"?'maxlength="2"':""} ${required?"required":""}>`}</label>`).join("");
        document.body.insertAdjacentHTML("beforeend", `<dialog class="hub-dialog" data-create-dialog><form method="dialog"><header><h2>${escapeHtml(formConfig.title)}</h2><button value="cancel" aria-label="Fechar">×</button></header><div class="hub-form-grid">${fields}</div><p class="hub-note">Cadastre somente dados documentados e necessários para a finalidade institucional.</p><p class="hub-form-status" aria-live="polite"></p><footer><button value="cancel">Cancelar</button><button type="submit" data-confirm-create>Salvar cadastro</button></footer></form></dialog>`);
        const dialog = document.querySelector("[data-create-dialog]");
        document.querySelector("[data-open-create]").addEventListener("click",()=>dialog.showModal());
        dialog.querySelector("form").addEventListener("submit", async event => {
          if (event.submitter?.value === "cancel") return;
          event.preventDefault();
          const submit = dialog.querySelector("[data-confirm-create]");
          const formStatus = dialog.querySelector(".hub-form-status");
          const data = Object.fromEntries(new FormData(event.currentTarget));
          data.consent = event.currentTarget.elements.consent?.checked || false;
          if (view === "impacto" && !data.numeric_value && !data.text_value) { formStatus.textContent = "Informe um valor numérico ou textual."; return; }
          Object.keys(data).forEach(key => { if (data[key] === "") data[key] = null; });
          submit.disabled = true;
          formStatus.textContent = "Salvando…";
          const payload = formConfig.transform(data);
          Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
          const saved = await window.ASAS_AUTH.request(`/rest/v1/${module.table}`, { method:"POST", headers:{ Prefer:"return=minimal" }, body:JSON.stringify(payload) }, token);
          if (saved.ok) location.reload();
          else { formStatus.textContent = "Não foi possível salvar. Confira os campos ou sua permissão."; submit.disabled = false; }
        });
      }
    }
  }

  if (!authContext.demo && view === "relatorios") {
    const token = window.ASAS_AUTH.readSession().access_token;
    const target = document.querySelector("[data-report-content]");
    const response = await window.ASAS_AUTH.request("/rest/v1/asas_audit_log?select=occurred_at,action,entity_type,entity_id&order=occurred_at.desc&limit=200",{},token);
    if (!response.ok) target.innerHTML = '<p class="hub-empty">Seu perfil não possui acesso à auditoria.</p>';
    else {
      const rows = await response.json();
      const counts = rows.reduce((acc,row)=>(acc[row.entity_type]=(acc[row.entity_type]||0)+1,acc),{});
      target.innerHTML = `<h2>Trilha de auditoria</h2><p class="hub-note">Exibe os 200 eventos mais recentes. O relatório não inclui senhas, cartões ou conteúdo pessoal dos registros alterados.</p>${rows.length?`<div class="hub-table"><div class="hub-tr hub-th"><span>Data</span><span>Ação</span><span>Entidade</span><span>Registro</span><span>Eventos da entidade</span><span>Controle</span></div>${rows.map(row=>`<div class="hub-tr"><span>${new Date(row.occurred_at).toLocaleString("pt-BR")}</span><span>${escapeHtml(row.action)}</span><span>${escapeHtml(row.entity_type)}</span><span>${escapeHtml(row.entity_id||"—")}</span><span>${counts[row.entity_type]}</span><span>Auditado</span></div>`).join("")}</div>`:'<p class="hub-empty">Nenhum evento registrado.</p>'}`;
    }
  }

  if (!authContext.demo && view === "usuarios") {
    const token = window.ASAS_AUTH.readSession().access_token;
    const target = document.querySelector("[data-user-content]");
    const response = await window.ASAS_AUTH.request("/rest/v1/asas_staff_profiles?select=user_id,display_name,role,roles,active,created_at,updated_at&order=created_at.asc&limit=100",{},token);
    if (!response.ok) target.innerHTML = '<p class="hub-empty">Seu perfil não possui acesso à gestão de usuários.</p>';
    else {
      const rows = await response.json();
      const invite = hasRole(["admin"]) ? '<button type="button" data-open-invite>+ Convidar usuário</button>' : "";
      const roleOptions = ["relacionamento","financeiro","projetos","auditoria","admin"];
      target.innerHTML = `<div class="hub-toolbar">${invite}</div><h2>Equipe autorizada</h2><p class="hub-note">Cada pessoa deve possuir conta individual. Nunca compartilhe acessos.</p><div class="hub-table"><div class="hub-tr hub-th"><span>Nome</span><span>Perfis</span><span>Status</span><span>Criado em</span><span>Atualizado em</span><span>Ação</span></div>${rows.map(row=>`<div class="hub-tr" data-staff-id="${escapeHtml(row.user_id)}"><span>${escapeHtml(row.display_name)}</span><span>${hasRole(["admin"])?roleOptions.map(role=>`<label><input type="checkbox" data-staff-role value="${role}" ${(row.roles?.length?row.roles:[row.role]).includes(role)?"checked":""}> ${role}</label>`).join(""):escapeHtml((row.roles?.length?row.roles:[row.role]).join(", "))}</span><span>${hasRole(["admin"])?`<label><input type="checkbox" data-staff-active ${row.active?"checked":""}> Ativo</label>`:(row.active?"Ativo":"Inativo")}</span><span>${new Date(row.created_at).toLocaleDateString("pt-BR")}</span><span>${new Date(row.updated_at).toLocaleDateString("pt-BR")}</span><span>${hasRole(["admin"])?'<button type="button" data-save-staff>Salvar</button>':escapeHtml(row.user_id.slice(0,8))+"…"}</span></div>`).join("")}</div><p class="hub-form-status" data-staff-status aria-live="polite"></p>`;
      if (hasRole(["admin"])) {
        target.addEventListener("click", async event => {
          const button = event.target.closest("[data-save-staff]"); if (!button) return;
          const row = button.closest("[data-staff-id]"); const roles = [...row.querySelectorAll("[data-staff-role]:checked")].map(input=>input.value);
          const status = target.querySelector("[data-staff-status]");
          if (!roles.length) { status.textContent = "Selecione ao menos um perfil."; return; }
          if (!confirm("Confirma a alteração dos perfis e do status deste usuário?")) return;
          button.disabled = true; status.textContent = "Salvando permissões…";
          const saved = await fetch("https://yljvlllrvibyongccgmz.supabase.co/functions/v1/staff-manage",{method:"PATCH",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify({user_id:row.dataset.staffId,roles,active:row.querySelector("[data-staff-active]").checked})});
          if (saved.ok) location.reload(); else { const detail=await saved.json().catch(()=>({})); status.textContent=detail.error==="cannot_remove_own_admin_access"?"Você não pode remover seu próprio acesso administrativo.":"Não foi possível alterar as permissões."; button.disabled=false; }
        });
        document.body.insertAdjacentHTML("beforeend", `<dialog class="hub-dialog" data-invite-dialog><form><header><h2>Convidar usuário</h2><button type="button" data-close-invite aria-label="Fechar">×</button></header><div class="hub-form-grid"><label>Nome completo<input name="display_name" required maxlength="120"></label><label>E-mail institucional<input type="email" name="email" required maxlength="180"></label><fieldset><legend>Perfis de acesso</legend><label><input type="checkbox" name="roles" value="relacionamento"> Relacionamento</label><label><input type="checkbox" name="roles" value="financeiro"> Financeiro</label><label><input type="checkbox" name="roles" value="projetos"> Projetos</label><label><input type="checkbox" name="roles" value="auditoria"> Leitura/Auditoria</label><label><input type="checkbox" name="roles" value="admin"> Administrador</label></fieldset></div><p class="hub-note">Ao confirmar, o Supabase enviará um convite ao e-mail informado.</p><p class="hub-form-status" aria-live="polite"></p><footer><button type="button" data-close-invite>Cancelar</button><button type="submit" data-send-invite>Enviar convite</button></footer></form></dialog>`);
        const dialog = document.querySelector("[data-invite-dialog]");
        document.querySelector("[data-open-invite]").addEventListener("click",()=>dialog.showModal());
        dialog.querySelectorAll("[data-close-invite]").forEach(button=>button.addEventListener("click",()=>dialog.close()));
        dialog.querySelector("form").addEventListener("submit",async event=>{
          event.preventDefault();
          if (!confirm("Confirma o envio do convite institucional e a criação deste perfil de acesso?")) return;
          const button = dialog.querySelector("[data-send-invite]"), status = dialog.querySelector(".hub-form-status"), formData = new FormData(event.currentTarget), data = {display_name:formData.get("display_name"),email:formData.get("email"),roles:formData.getAll("roles")};
          if (!data.roles.length) { status.textContent="Selecione pelo menos um perfil de acesso."; return; }
          button.disabled=true; status.textContent="Enviando convite…";
          const sent = await fetch("https://yljvlllrvibyongccgmz.supabase.co/functions/v1/staff-invite",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify(data)});
          if (sent.ok) location.reload(); else { status.textContent="Não foi possível enviar. Confira o e-mail, o perfil ou se a pessoa já possui acesso."; button.disabled=false; }
        });
      }
    }
  }
  if (!authContext.demo) {
    const header = document.querySelector(".hub-main > header");
    const profileButton = header?.querySelector(":scope > button");
    if (profileButton) {
      profileButton.textContent = "Encerrar sessão";
      profileButton.setAttribute("aria-label", "Encerrar sessão com segurança");
      profileButton.addEventListener("click", async () => {
        profileButton.disabled = true;
        profileButton.textContent = "Encerrando…";
        await window.ASAS_AUTH.signOut();
        location.replace(view === "mantenedor" ? "../login.html?signedout=1" : "login.html?signedout=1");
      });
    }
  }
})();
