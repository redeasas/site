(() => {
  const config = window.ASAS_CONFIG;
  if (!config) return;
  const { organization: org, urls } = config;
  const page = location.pathname.split("/").pop() || "index.html";
  const activePage = page === "noticias.html" ? "historias.html" : page;
  const navItems = [
    ["index.html", "Início"], ["quem-somos.html", "Quem somos"],
    ["projetos.html", "Projetos"], ["impacto.html", "Impacto"],
    ["transparencia.html", "Transparência"], ["historias.html", "Histórias e conquistas"],
    ["novo-predio.html", "Novo prédio"], ["apoie.html", "Quero apoiar"],
  ];

  const header = document.querySelector("header.header");
  if (header) {
    header.innerHTML = `<a class="brand" href="index.html" aria-label="Rede ASAS Brasil — início"><img src="assets/images/logo-rede-asas-principal-crop.jpeg" alt="Rede ASAS Brasil" width="186" height="76"></a><button class="menu" type="button" data-menu-toggle aria-controls="main-nav" aria-label="Abrir menu" aria-expanded="false">Menu</button><nav id="main-nav" data-nav aria-label="Navegação principal">${navItems.map(([href,label]) => `<a href="${href}"${href === activePage ? ' class="active" aria-current="page"' : href === "apoie.html" ? ' class="nav-cta"' : ""}>${label}</a>`).join("")}</nav>`;
  }

  document.querySelectorAll(".utility").forEach((el) => {
    el.innerHTML = `<span>${org.publicName} · Desde ${org.foundedYear}</span><div><a href="${org.instagram}" target="_blank" rel="noopener">Instagram</a><a href="https://wa.me/${org.whatsappNumber}" target="_blank" rel="noopener">WhatsApp</a></div>`;
  });

  const canonicalPage = page === "noticias.html" ? "historias.html" : page;
  const canonicalPath = canonicalPage === "index.html" ? "/" : `/${canonicalPage.replace(".html", "")}`;
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
  canonical.href = `${urls.canonical}${canonicalPath}`;
  const socialImage = `${urls.canonical}/assets/images/hero-fachada-rede-asas.jpeg`;
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
  if (footer) footer.innerHTML = `<div class="footer-main"><div><img src="assets/images/logo-rede-asas-principal-crop.jpeg" alt="Rede ASAS Brasil" width="760" height="430"><p>Desde 1996, educação, cuidado e oportunidades.</p></div><div><h3>Institucional</h3><a href="quem-somos.html">Quem somos</a><a href="projetos.html">Projetos</a><a href="impacto.html">Impacto</a><a href="transparencia.html">Transparência</a></div><div><h3>Participe</h3><a href="novo-predio.html">Novo prédio</a><a href="apoie.html">Quero apoiar</a><a href="historias.html">Histórias e conquistas</a><a href="privacidade.html">Privacidade</a></div><div><h3>Contato oficial</h3><a href="mailto:${org.email}">${org.email}</a><a href="https://wa.me/${org.whatsappNumber}">${org.whatsappDisplay}</a><p>${org.address}</p></div></div><div class="footer-legal"><span>© ${new Date().getFullYear()} ${org.publicName}</span><span>CNPJ ${org.cnpj}</span></div>`;

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
    if (link.closest(".hero-actions,.cta,.ways-grid")) track("cta_click", { link_text: link.textContent.trim(), link_url: link.href });
  });

  document.querySelectorAll("[data-lead-form],[data-contact-form]").forEach((form) => form.addEventListener("submit", (event) => {
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
    track("lead_submit", { lead_type: data.get("interesse") || form.dataset.formType || "contato" });
    const subject = `Contato pelo site — ${data.get("interesse") || form.dataset.formType || "Rede ASAS"}`;
    window.location.href = `mailto:${org.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    const status = form.querySelector("[data-form-status]");
    if (status) status.textContent = "Seu aplicativo de e-mail será aberto. O contato só será enviado após você confirmar a mensagem nele.";
    setTimeout(() => { form.dataset.submitting = "false"; }, 3000);
  }));

  const helpWidget = document.createElement("aside");
  helpWidget.className = "help-widget";
  const supportOptions = [["Olá! Acessei o site da Rede ASAS Brasil e gostaria de informações para fazer uma doação.", "Quero doar"], ["Olá! Acessei a página do novo prédio da Rede ASAS Brasil e gostaria de receber informações sobre como apoiar a construção.", "Apoiar o novo prédio"], ["Olá! Acessei a página de apoio da Rede ASAS Brasil e gostaria de conversar sobre parceria empresarial.", "Parceria empresarial"], ["Olá! Acessei o site da Rede ASAS Brasil e gostaria de informações sobre voluntariado.", "Voluntariado"], ["Olá! Acessei a página de apoio da Rede ASAS Brasil e gostaria de doar materiais.", "Doar materiais"], ["Olá! Acessei a página de apoio da Rede ASAS Brasil e gostaria de oferecer serviços.", "Oferecer serviços"], ["Olá! Acessei o site da Rede ASAS Brasil e gostaria de agendar uma visita institucional.", "Agendar visita"]];
  helpWidget.innerHTML = `<button class="help-trigger" type="button" aria-expanded="false" aria-controls="help-panel"><span class="help-dot" aria-hidden="true"></span>Posso ajudar?</button><div class="help-panel" id="help-panel" hidden role="dialog" aria-modal="false" aria-labelledby="help-title"><button class="help-close" type="button" aria-label="Fechar atendimento">×</button><p class="help-greeting">Olá! 👋</p><h2 id="help-title">Como podemos ajudar?</h2><p>Escolha uma opção para falar com a equipe.</p><div class="help-options">${supportOptions.map(([message,label]) => `<a href="https://wa.me/${org.whatsappNumber}?text=${encodeURIComponent(message)}">${label}<span>→</span></a>`).join("")}</div><small>WhatsApp oficial: ${org.whatsappDisplay}</small></div>`;
  document.body.appendChild(helpWidget);
  const trigger = helpWidget.querySelector(".help-trigger"), panel = helpWidget.querySelector(".help-panel"), closer = helpWidget.querySelector(".help-close");
  const focusables = () => [...panel.querySelectorAll('button,a[href]')];
  const setHelp = (open) => { panel.hidden = !open; panel.setAttribute("aria-modal", String(open)); trigger.setAttribute("aria-expanded", String(open)); if (open) closer.focus(); };
  trigger.addEventListener("click", () => setHelp(panel.hidden)); closer.addEventListener("click", () => { setHelp(false); trigger.focus(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !panel.hidden) { setHelp(false); trigger.focus(); } });
  panel.addEventListener("keydown", (event) => { if (event.key !== "Tab") return; const items = focusables(); const first = items[0], last = items[items.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } });

  document.querySelectorAll("[data-copy-pix]").forEach((button) => button.addEventListener("click", async () => { try { await navigator.clipboard.writeText(config.donation.pixKey.replace(/\D/g, "")); button.textContent = "Chave copiada!"; track("pix_copy"); setTimeout(() => button.textContent = "Copiar chave PIX", 2500); } catch { button.textContent = `PIX: ${config.donation.pixKey}`; } }));
})();
