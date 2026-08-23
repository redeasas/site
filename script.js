(() => {
  const config = window.ASAS_CONFIG;
  if (!config) return;
  const { organization: org, urls } = config;
  const page = location.pathname.split("/").pop() || "index.html";
  const nestedProject = location.pathname.includes("/projetos/");
  const rootPrefix = nestedProject ? "../../" : "";
  const activePage = nestedProject ? "projetos.html" : page === "noticias.html" ? "historias.html" : page;
  const navItems = [
    ["index.html", "Início"], ["quem-somos.html", "Quem somos"],
    ["projetos.html", "Projetos"], ["impacto.html", "Impacto"],
    ["empresas.html", "Empresas"], ["transparencia.html", "Transparência"],
    ["novo-predio.html", "Novo prédio"], ["apoie.html", "Quero apoiar"],
  ];

  const header = document.querySelector("header.header");
  if (header) {
    header.innerHTML = `<a class="brand" href="${rootPrefix}index.html" aria-label="Rede ASAS Brasil — início"><img src="${rootPrefix}assets/images/logo-rede-asas-principal-crop.jpeg" alt="Rede ASAS Brasil" width="186" height="76"></a><button class="menu" type="button" data-menu-toggle aria-controls="main-nav" aria-label="Abrir menu" aria-expanded="false">Menu</button><nav id="main-nav" data-nav aria-label="Navegação principal">${navItems.map(([href,label]) => `<a href="${rootPrefix}${href}"${href === activePage ? ' class="active" aria-current="page"' : href === "apoie.html" ? ' class="nav-cta"' : ""}>${label}</a>`).join("")}</nav>`;
  }

  document.querySelectorAll(".utility").forEach((el) => {
    el.innerHTML = `<span>${org.publicName} · Desde ${org.foundedYear}</span><div><a href="${org.instagram}" target="_blank" rel="noopener">Instagram</a><a href="https://wa.me/${org.whatsappNumber}" target="_blank" rel="noopener">WhatsApp</a></div>`;
  });

  const canonicalPage = page === "noticias.html" ? "historias.html" : page;
  const canonicalPath = nestedProject ? location.pathname.replace(/\/$/, "") : canonicalPage === "index.html" ? "/" : `/${canonicalPage.replace(".html", "")}`;
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
  canonical.href = `${urls.canonical}${canonicalPath}`;
  const socialImage = `${urls.canonical}/assets/images/social-rede-asas-1200x630.png`;
  if (!document.querySelector('link[rel="apple-touch-icon"]')) { const icon = document.createElement("link"); icon.rel = "apple-touch-icon"; icon.href = "assets/images/logo-rede-asas-principal-crop.jpeg"; document.head.appendChild(icon); }
  const metas = { "og:type": "website", "og:locale": "pt_BR", "og:site_name": org.publicName, "og:title": document.title, "og:description": document.querySelector('meta[name="description"]')?.content || "", "og:url": canonical.href, "og:image": socialImage, "twitter:card": "summary_large_image" };
  Object.entries(metas).forEach(([key, content]) => { let meta = document.querySelector(`meta[property="${key}"],meta[name="${key}"]`); if (!meta) { meta = document.createElement("meta"); meta.setAttribute(key.startsWith("twitter") ? "name" : "property", key); document.head.appendChild(meta); } meta.content = content; });
  const graph = [{ "@type": "NGO", "@id": `${urls.canonical}/#organization`, name: org.publicName, legalName: org.legalName, url: urls.canonical, email: org.email, telephone: org.whatsappDisplay, taxID: org.cnpj, foundingDate: String(org.foundedYear), address: { "@type": "PostalAddress", streetAddress: "Rua Alair Pereira da Silva, 205", addressLocality: "Belo Horizonte", addressRegion: "MG", addressCountry: "BR" }, sameAs: [org.instagram] }, { "@type": "WebSite", "@id": `${urls.canonical}/#website`, url: `${urls.canonical}/`, name: org.publicName, publisher: { "@id": `${urls.canonical}/#organization` }, inLanguage: "pt-BR" }];
  if (page === "novo-predio.html") graph.push({ "@type": "FAQPage", mainEntity: [...document.querySelectorAll(".faq-list details")].map((item) => ({ "@type": "Question", name: item.querySelector("summary")?.textContent.trim(), acceptedAnswer: { "@type": "Answer", text: item.querySelector("p")?.textContent.trim() } })) });
  const schema = document.createElement("script"); schema.type = "application/ld+json"; schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }); document.head.appendChild(schema);

  if (page === "novo-predio.html") {
    const main = document.querySelector("main");
    const impact = main?.querySelector(".building-impact");
    const plan = main?.querySelector(".building-plan");
    const roadmap = main?.querySelector(".building-roadmap");
    const budget = main?.querySelector(".building-budget");
    if (impact && plan) main.insertBefore(impact, plan);
    if (roadmap && budget) main.insertBefore(roadmap, budget);
  }

  const footer = document.querySelector("footer.footer");
  if (footer) footer.innerHTML = `<div class="footer-main"><div><img src="assets/images/logo-rede-asas-principal-crop.jpeg" alt="Rede ASAS Brasil" width="760" height="430"><p>Desde 1996, educação, cuidado e oportunidades.</p><a href="confiar.html">Por que confiar</a></div><div><h3>Institucional</h3><a href="quem-somos.html">Quem somos</a><a href="projetos.html">Projetos</a><a href="impacto.html">Impacto</a><a href="historias.html">Histórias</a></div><div><h3>Transparência</h3><a href="transparencia.html">Portal da Transparência</a><a href="relatorios.html">Relatórios</a><a href="governanca.html">Governança</a><a href="integridade.html">Integridade</a></div><div><h3>Participe</h3><a href="apoie.html">Quero apoiar</a><a href="novo-predio.html">Novo prédio</a><a href="empresas.html">Empresas</a><a href="voluntariado.html">Voluntariado</a><a href="visita.html">Agendar visita</a></div><div><h3>Contato oficial</h3><a href="mailto:${org.email}">${org.email}</a><a href="https://wa.me/${org.whatsappNumber}">${org.whatsappDisplay}</a><a href="privacidade.html">Privacidade</a><p>${org.address}</p></div></div><div class="footer-legal"><span>© ${new Date().getFullYear()} ${org.publicName}</span><span>CNPJ ${org.cnpj}</span></div>`;
  if (nestedProject && footer) {
    footer.querySelector('img[src^="assets/"]')?.setAttribute("src", `${rootPrefix}assets/images/logo-rede-asas-principal-crop.jpeg`);
    footer.querySelectorAll('a[href$=".html"]').forEach((link) => link.setAttribute("href", `${rootPrefix}${link.getAttribute("href")}`));
  }

  const analyticsId = config.integrations?.analytics?.measurementId;
  const loadAnalytics = () => {
    if (!/^G-[A-Z0-9]+$/.test(analyticsId || "") || document.querySelector("[data-google-analytics]")) return;
    const analyticsScript = document.createElement("script");
    analyticsScript.async = true;
    analyticsScript.dataset.googleAnalytics = "true";
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
    document.head.appendChild(analyticsScript);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", analyticsId, { anonymize_ip: true, transport_type: "beacon", allow_google_signals: false, allow_ad_personalization_signals: false });
  };
  const consentKey = "asas_analytics_consent";
  if (localStorage.getItem(consentKey) === "granted") loadAnalytics();
  else if (/^G-[A-Z0-9]+$/.test(analyticsId || "") && localStorage.getItem(consentKey) !== "denied") {
    const consent = document.createElement("aside");
    consent.className = "consent-banner";
    consent.setAttribute("aria-label", "Preferências de métricas");
    consent.innerHTML = `<p><strong>Métricas de uso</strong> Podemos usar o Google Analytics para entender visitas e melhorar o site. Nenhum cookie de métricas será ativado sem sua escolha. <a href="privacidade.html">Saiba mais</a>.</p><div><button type="button" data-consent="denied">Recusar</button><button type="button" class="button blue" data-consent="granted">Aceitar métricas</button></div>`;
    document.body.appendChild(consent);
    consent.addEventListener("click", (event) => { const button = event.target.closest("[data-consent]"); if (!button) return; localStorage.setItem(consentKey, button.dataset.consent); if (button.dataset.consent === "granted") loadAnalytics(); consent.remove(); });
  }
  const searchToken = config.integrations?.searchConsole?.verificationToken;
  if (/^[A-Za-z0-9_-]{20,}$/.test(searchToken || "")) {
    const verification = document.createElement("meta");
    verification.name = "google-site-verification";
    verification.content = searchToken;
    document.head.appendChild(verification);
  }

  document.querySelectorAll("main").forEach((main) => { if (!main.id) main.id = "conteudo"; });
  if (!document.querySelector(".skip-link")) document.body.insertAdjacentHTML("afterbegin", '<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>');

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const closeMenu = (restoreFocus = false) => { nav?.classList.remove("is-open"); menuToggle?.setAttribute("aria-expanded", "false"); menuToggle?.setAttribute("aria-label", "Abrir menu"); if (restoreFocus && menuToggle) menuToggle.focus(); };
  menuToggle?.addEventListener("click", () => { const open = nav.classList.toggle("is-open"); menuToggle.setAttribute("aria-expanded", String(open)); menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu"); });
  nav?.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && nav?.classList.contains("is-open")) closeMenu(true); });

  document.querySelectorAll("img:not([loading])").forEach((img) => { if (!img.closest(".hero,.building-hero")) img.loading = "lazy"; img.decoding = "async"; });
  document.querySelectorAll(".project-cards article").forEach((card) => { const image = card.querySelector('img[alt=""]'); const title = card.querySelector("h3")?.textContent.trim(); if (image && title) image.alt = `Identidade visual do projeto ${title}`; });
  const projectFilters = document.querySelector(".project-filters");
  projectFilters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-project-filter]"); if (!button) return;
    const selected = button.dataset.projectFilter;
    projectFilters.querySelectorAll("button").forEach((item) => { const active = item === button; item.classList.toggle("active", active); item.setAttribute("aria-pressed", String(active)); });
    document.querySelectorAll("[data-project-group]").forEach((group) => { group.hidden = selected !== "todos" && group.dataset.projectGroup !== selected; });
    track("project_filter", { category: selected });
  });
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  if (!reducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add("is-visible"));

  const track = (event, detail = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...detail, page_path: location.pathname });
  };
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a"); if (!link) return;
    if (link.href.includes("wa.me")) track("whatsapp_click", { link_text: link.textContent.trim() });
    if (link.href.includes("benfeitoria.com")) track("campaign_click", { link_text: link.textContent.trim() });
    if (link.href.startsWith("mailto:")) track("email_click", { link_text: link.textContent.trim() });
    if (link.hasAttribute("data-share")) track("share_click", { channel: link.dataset.share });
    if (link.hasAttribute("download")) track("document_download", { link_url: link.href });
    if (link.href.includes("empresas.html")) track("business_interest", { link_text: link.textContent.trim() });
    if (link.href.includes("voluntariado.html")) track("volunteer_interest", { link_text: link.textContent.trim() });
    if (link.href.includes("apoiador.html")) track("supporter_area_visit", { link_text: link.textContent.trim() });
    if (link.closest(".hero-actions,.cta,.ways-grid")) track("cta_click", { link_text: link.textContent.trim(), link_url: link.href });
  });

  const fallbackToEmail = (data, lines, subject, status, form) => {
    try { window.location.href = `mailto:${org.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`; }
    catch { if (status) status.textContent = "Não foi possível abrir o e-mail. Use o atendimento no canto da tela."; form.dataset.submitting = "false"; return; }
    if (status) status.textContent = "Não foi possível registrar automaticamente. Seu aplicativo de e-mail foi aberto como alternativa.";
    setTimeout(() => { form.dataset.submitting = "false"; }, 3000);
  };
  document.querySelectorAll("[data-lead-form],[data-contact-form]").forEach((form) => {
    form.dataset.startedAt = String(Date.now());
    form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (form.querySelector('[name="website"]')?.value) return;
    const data = new FormData(form);
    if (form.dataset.submitting === "true") return;
    form.dataset.submitting = "true";
    const query = new URLSearchParams(location.search);
    const lines = [...data.entries()].filter(([key]) => !["website", "consentimento"].includes(key)).map(([key,value]) => `${key}: ${value}`);
    lines.push(`Página de origem: ${location.href}`);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => { if (query.get(key)) lines.push(`${key}: ${query.get(key)}`); });
    const leadType = data.get("interesse") || form.dataset.formType || "contato";
    const status = form.querySelector("[data-form-status]");
    track("lead_submit", { lead_type: leadType });
    if (form.dataset.formType === "newsletter") track("newsletter_interest", { preferences: data.getAll("preferencias").join(",") });
    const subject = `Contato pelo site — ${data.get("interesse") || form.dataset.formType || "Rede ASAS"}`;
    const endpoint = config.forms?.endpoint;
    if (!endpoint) { fallbackToEmail(data, lines, subject, status, form); return; }
    const payload = Object.fromEntries([...data.entries()].filter(([key]) => !["website"].includes(key)));
    payload.form_type = form.dataset.formType || "contato";
    payload.page_url = location.href;
    payload.referrer = document.referrer || null;
    payload.started_at = Number(form.dataset.startedAt);
    payload.submitted_at = Date.now();
    payload.idempotency_key = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => { if (query.get(key)) payload[key] = query.get(key); });
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      form.dataset.startedAt = String(Date.now());
      if (status) status.textContent = "Contato recebido com segurança. A equipe da Rede ASAS retornará pelos dados informados.";
      track("lead_success", { lead_type: leadType });
      setTimeout(() => { form.dataset.submitting = "false"; }, 3000);
    } catch {
      track("form_error", { lead_type: leadType });
      fallbackToEmail(data, lines, subject, status, form);
    }
  }); });

  const helpWidget = document.createElement("aside");
  helpWidget.className = "help-widget";
  const supportOptions = {
    doar: { label: "Quero doar", answer: "Você pode apoiar por PIX, pela campanha do novo prédio ou conversar sobre uma contribuição recorrente.", links: [["apoie.html", "Ver formas de doação"], ["novo-predio.html#como-apoiar", "Apoiar o novo prédio"]], whatsapp: "Olá! O assistente do site me orientou sobre doações e preciso falar com a equipe." },
    predio: { label: "Novo prédio", answer: "O projeto possui estimativa preliminar de julho de 2026 e projeto estrutural emitido em 14/07/2026. Arrecadação e cronograma seguem sem conciliação pública.", links: [["novo-predio.html", "Acompanhar o projeto"]], whatsapp: "Olá! O assistente do site me orientou sobre o novo prédio e preciso de atendimento." },
    projetos: { label: "Conhecer projetos", answer: "A Rede ASAS atua com educação, esporte, cultura, tecnologia e fortalecimento familiar no Taquaril.", links: [["projetos.html", "Conhecer os projetos"]], whatsapp: "Olá! Gostaria de orientação da equipe sobre os projetos da Rede ASAS." },
    empresas: { label: "Parceria empresarial", answer: "Empresas podem apoiar financeiramente, doar materiais ou serviços e construir parcerias institucionais.", links: [["empresas.html", "Ver opções para empresas"]], whatsapp: "Olá! O assistente do site me orientou sobre parceria empresarial e quero falar com a equipe." },
    voluntariado: { label: "Voluntariado", answer: "O cadastro de interesse reúne seus dados e a equipe avalia oportunidades conforme as necessidades dos projetos.", links: [["voluntariado.html", "Cadastrar interesse"]], whatsapp: "Olá! O assistente do site me orientou sobre voluntariado e preciso falar com a equipe." },
    contato: { label: "Outro assunto", answer: "Posso encaminhar você para o WhatsApp oficial da Rede ASAS. Informe no início da mensagem o assunto e como prefere receber retorno.", links: [], whatsapp: "Olá! Vim pelo assistente do site da Rede ASAS Brasil e preciso de atendimento." },
  };
  helpWidget.innerHTML = `<button class="help-trigger" type="button" aria-expanded="false" aria-controls="help-panel"><span class="help-dot" aria-hidden="true"></span>Posso ajudar?</button><div class="help-panel" id="help-panel" hidden role="dialog" aria-modal="false" aria-labelledby="help-title"><button class="help-close" type="button" aria-label="Fechar atendimento">×</button><div class="help-chat" aria-live="polite"><p class="help-greeting">Assistente virtual da Rede ASAS</p><h2 id="help-title">Como posso ajudar?</h2><div class="help-message bot">Escolha um assunto. Vou orientar você aqui e só encaminharei ao WhatsApp se for necessário.</div><div class="help-options">${Object.entries(supportOptions).map(([key,item]) => `<button type="button" data-help-topic="${key}">${item.label}<span>→</span></button>`).join("")}</div><div class="help-answer" data-help-answer hidden></div></div><small>Atendimento automatizado com informações públicas do site.</small></div>`;
  document.body.appendChild(helpWidget);
  const trigger = helpWidget.querySelector(".help-trigger"), panel = helpWidget.querySelector(".help-panel"), closer = helpWidget.querySelector(".help-close");
  const focusables = () => [...panel.querySelectorAll('button,a[href]')];
  const setHelp = (open) => { panel.hidden = !open; panel.setAttribute("aria-modal", String(open)); trigger.setAttribute("aria-expanded", String(open)); if (open) closer.focus(); };
  trigger.addEventListener("click", () => setHelp(panel.hidden)); closer.addEventListener("click", () => { setHelp(false); trigger.focus(); });
  const options = helpWidget.querySelector(".help-options"), answer = helpWidget.querySelector("[data-help-answer]");
  options.addEventListener("click", (event) => {
    const button = event.target.closest("[data-help-topic]"); if (!button) return;
    const item = supportOptions[button.dataset.helpTopic]; if (!item) return;
    const links = item.links.map(([href,label]) => `<a href="${rootPrefix}${href}">${label}<span>→</span></a>`).join("");
    const whatsapp = `https://wa.me/${org.whatsappNumber}?text=${encodeURIComponent(item.whatsapp)}`;
    answer.hidden = false;
    answer.innerHTML = `<div class="help-message user">${item.label}</div><div class="help-message bot">${item.answer}</div><div class="help-actions">${links}<a class="help-whatsapp" href="${whatsapp}" target="_blank" rel="noopener">Ainda preciso falar com a equipe</a><button type="button" data-help-back>Escolher outro assunto</button></div>`;
    options.hidden = true;
    answer.querySelector("a,button")?.focus();
    track("chatbot_topic", { topic: button.dataset.helpTopic });
  });
  answer.addEventListener("click", (event) => { if (!event.target.closest("[data-help-back]")) return; answer.hidden = true; answer.innerHTML = ""; options.hidden = false; options.querySelector("button")?.focus(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !panel.hidden) { setHelp(false); trigger.focus(); } });
  panel.addEventListener("keydown", (event) => { if (event.key !== "Tab") return; const items = focusables(); const first = items[0], last = items[items.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } });

  document.querySelectorAll("[data-copy-pix]").forEach((button) => button.addEventListener("click", async () => { try { await navigator.clipboard.writeText(config.donation.pixKey.replace(/\D/g, "")); button.textContent = "Chave copiada!"; track("pix_copy"); setTimeout(() => button.textContent = "Copiar chave PIX", 2500); } catch { button.textContent = `PIX: ${config.donation.pixKey}`; } }));
  document.querySelectorAll("[data-support-cause]").forEach((link) => link.addEventListener("click", () => {
    const cause = link.dataset.supportCause;
    const message = document.querySelector('#formulario textarea[name="mensagem"]');
    if (message && !message.value) message.value = `Gostaria de apoiar a finalidade: ${cause}.`;
    track("support_cause_selected", { cause });
  }));
})();
