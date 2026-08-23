(() => {
  const sourcePolicy = Object.freeze({
    allowed: ["site oficial", "repositório", "documento institucional", "integração oficial autorizada"],
    instagram: "fonte complementar; nunca preenche campos operacionais, financeiros ou de impacto sem validação institucional",
    missingLabel: "Informação em atualização",
  });
  const projects = {
    "centro-infantil": { name:"Centro Infantil Caminho do Céu", category:"Educação", summary:"Educação infantil, alimentação, cuidado e desenvolvimento integral." },
    "faculdade-comunitaria": { name:"Faculdade Comunitária", category:"Educação", summary:"Formação acessível e incentivo ao crescimento educacional." },
    "biblioteca-comunitaria": { name:"Biblioteca Comunitária", category:"Educação", summary:"Leitura, imaginação, apoio escolar e acesso à cultura." },
    "informatica": { name:"Informática", category:"Tecnologia", summary:"Inclusão digital, autonomia e novas oportunidades." },
    "futebol": { name:"Futebol", category:"Esporte", summary:"Iniciativa esportiva informada pela instituição." },
    "volei": { name:"Vôlei", category:"Esporte", summary:"Iniciativa esportiva informada pela instituição." },
    "judo": { name:"Judô", category:"Esporte", summary:"Disciplina, respeito, foco e caráter por meio do esporte." },
    "musicalizacao": { name:"Musicalização", category:"Cultura", summary:"Música para despertar expressão, convivência e confiança." },
    "danca": { name:"Dança", category:"Cultura", summary:"Iniciativa cultural informada pela instituição." },
    "midias-digitais": { name:"Mídias Digitais", category:"Tecnologia", summary:"Comunicação, criatividade e produção de conteúdo." },
    "podcast": { name:"Podcast", category:"Tecnologia", summary:"Vozes da comunidade, histórias e ideias que inspiram." },
    "video-fotografia": { name:"Vídeo e Fotografia", category:"Tecnologia", summary:"Iniciativa de comunicação informada pela instituição." },
    "familias-fortes": { name:"Famílias Fortes", category:"Famílias", summary:"Fortalecimento de vínculos, orientação e proteção social." },
    "viver-bem": { name:"Viver Bem", category:"Famílias", summary:"Cuidado, convivência e apoio para uma vida digna e saudável." }
  };
  Object.values(projects).forEach((project) => {
    project.validation = Object.freeze({
      name: { status: "institutional", source: "Inventário institucional do site" },
      category: { status: "institutional", source: "Organização editorial do site" },
      summary: { status: "institutional", source: "Conteúdo institucional do repositório" },
      audience: { status: "pending", value: null },
      frequency: { status: "pending", value: null },
      capacity: { status: "pending", value: null },
      schedule: { status: "pending", value: null },
      indicators: { status: "pending", value: null },
      budget: { status: "pending", value: null },
    });
  });
  window.ASAS_PROJECT_SOURCE_POLICY = sourcePolicy;
  window.ASAS_PROJECTS = projects;
  const slugByName = Object.fromEntries(Object.entries(projects).map(([slug,item]) => [item.name,slug]));
  document.querySelectorAll(".project-cards article").forEach((card) => {
    const name = card.querySelector("h3")?.textContent.trim();
    const slug = slugByName[name];
    if (slug && !card.querySelector(".project-detail-link")) card.insertAdjacentHTML("beforeend", `<a class="project-detail-link" href="projetos/${slug}">Ver página do projeto →</a>`);
  });
  const detail = document.querySelector("[data-project-detail]");
  if (!detail) return;
  const root = location.pathname.includes("/projetos/") ? "../../" : "";
  const slug = location.pathname.split("/").filter(Boolean).pop() || new URLSearchParams(location.search).get("projeto");
  const project = projects[slug];
  if (!project) { detail.innerHTML = `<div class="notice-box"><strong>Projeto não encontrado</strong><p>Volte à lista de projetos para escolher uma frente de atuação.</p><a class="text-link" href="${root}projetos.html">Ver projetos →</a></div>`; return; }
  document.title = `${project.name} | Rede ASAS Brasil`;
  detail.innerHTML = `<nav class="breadcrumb" aria-label="Navegação estrutural"><a href="${root}index.html">Início</a> → <a href="${root}projetos.html">Projetos</a> → ${project.name}</nav><header class="project-detail-header"><p class="overline blue">${project.category}</p><h1>${project.name}</h1><p>${project.summary}</p><span class="data-status">Informações operacionais em atualização</span></header><div class="project-facts"><article><h2>Problema social e objetivo</h2><p>Informação em atualização pela equipe responsável.</p></article><article><h2>Público e faixa etária</h2><p>Informação em atualização.</p></article><article><h2>Capacidade, vagas e frequência</h2><p>Informação em atualização. Consulte a equipe antes de encaminhar participantes.</p></article><article><h2>Horário e local</h2><p>Informação em atualização.</p></article><article><h2>Equipe e metodologia</h2><p>Informação em atualização.</p></article><article><h2>Resultados e indicadores</h2><p>Aguardando validação documental. Nenhum resultado não comprovado é exibido.</p></article><article><h2>Necessidades e orçamento</h2><p>Informação em atualização.</p></article><article><h2>Responsável e atualização</h2><p>Responsável: em atualização.<br>Data de atualização: aguardando validação institucional.</p></article></div><div class="cta"><div><p class="overline">Como participar</p><h2>Apoie ou solicite informações sobre este projeto.</h2></div><a class="button primary" href="${root}apoie.html?projeto=${encodeURIComponent(project.name)}#formulario">Conversar com a equipe</a></div>`;
})();
