/* Fonte única de dados institucionais. Alterações devem ser validadas pela direção. */
window.ASAS_CONFIG = Object.freeze({
  organization: {
    publicName: "Rede ASAS Brasil",
    legalName: "Associação Shekinah de Assistência Social — ASAS",
    cnpj: "01.160.544/0001-83",
    foundedYear: 1996,
    address: "Rua Alair Pereira da Silva, 205 — Taquaril, Belo Horizonte/MG",
    email: "contato@redeasas.org.br",
    whatsappDisplay: "(31) 98960-8865",
    whatsappNumber: "5531989608865",
    instagram: "https://www.instagram.com/redeasasbr/",
  },
  urls: {
    canonical: "https://redeasas.org.br",
    preview: "https://rede-asas-brasil.vercel.app",
    campaign: "https://benfeitoria.com/projeto/ampliacaoredeasasbrasil",
  },
  donation: {
    pixKey: "01.160.544/0001-83",
    qrImage: "assets/images/qrcode-pix.jpeg",
    beneficiary: "Associação Shekinah de Assistência Social — ASAS",
    purpose: "Construção Prédio Rede ASAS",
    verifiedAt: "2026-08-09",
  },
  metrics: [
    { value: "+580", label: "vidas atendidas diariamente", status: "pending", source: "Dado institucional pendente de validação", baseDate: "Pendente" },
    { value: "+140", label: "crianças na educação infantil", status: "pending", source: "Dado institucional pendente de validação", baseDate: "Pendente" },
    { value: "11", label: "frentes de atuação social", status: "pending", source: "Dado institucional pendente de validação", baseDate: "Pendente" },
    { value: "30", label: "anos de atuação em 2026", status: "verified", source: "Ano de fundação informado: 1996", baseDate: "2026" },
  ],
  building: {
    area: "640 m²",
    estimate: "R$ 3.321.980,35",
    estimateShort: "R$ 3,32 milhões",
    lowScenario: "R$ 2.500.711,86",
    highScenario: "R$ 4.533.850,74",
    budgetDate: "julho de 2026",
    status: "Estimativa preliminar — não constitui orçamento executivo",
    raised: "DADO PENDENTE DE VALIDAÇÃO",
  },
  forms: { endpoint: null, mode: "email-fallback" },
  validationLabel: "DADO PENDENTE DE VALIDAÇÃO",
});
