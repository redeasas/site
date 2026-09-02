/* Dados públicos validados do novo prédio. Fonte: planilha oficial de controle. */
window.ASAS_OBRA = Object.freeze({
  reviewedAt: "2026-09-02",
  areaM2: 640,
  budget: { status: "estimativa-preliminar", low: 2500711.85934336, base: 3321980.35059456, high: 4533850.743459839, source: "Orcamento_Preliminar_Rede_ASAS_Brasil.xlsx" },
  raised: { value: 0, status: "campanha-nao-iniciada" },
  paid: { value: null, status: "aguardando-documentos-e-conciliacao" },
  balance: { value: null, status: "aguardando-conciliacao" },
  physicalProgress: { value: null, status: "aguardando-medicao-tecnica" },
});

(() => {
  const data = window.ASAS_OBRA;
  const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const set = (selector, value) => document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
  set("[data-obra-area]", `${data.areaM2} m²`);
  set("[data-obra-orcamento-base]", money.format(data.budget.base));
  set("[data-obra-orcamento-baixo]", money.format(data.budget.low));
  set("[data-obra-orcamento-alto]", money.format(data.budget.high));
})();
