-- Primeira carga controlada do ASAS HUB.
-- Estes registros são referências internas em RASCUNHO. Não alimentam o site público.
-- Valores de arrecadação, pagamentos e impacto permanecem vazios até conciliação documental.

insert into public.asas_knowledge_entries
  (id, title, category, content, source, status)
values
  (
    'd2fe27ba-19de-4b3f-a34b-b20afc3f91a1',
    'Novo prédio — área considerada no estudo preliminar',
    'Novo prédio',
    'O estudo preliminar considera área total construída de 640 m². O dado deve ser reconfirmado no orçamento executivo antes de divulgação como escopo definitivo.',
    'Orcamento_Preliminar_Rede_ASAS_Brasil.xlsx — abas Resumo e Premissas; estudo de viabilidade citado pela planilha',
    'rascunho'
  ),
  (
    'cf420f43-ee40-40c5-bcd7-3625ebc26079',
    'Novo prédio — cenários preliminares de custo',
    'Novo prédio',
    'Estimativas iniciais: cenário baixo R$ 2.500.711,86; cenário base R$ 3.321.980,35; cenário alto R$ 4.533.850,74. Não representam orçamento executivo, meta oficial de campanha ou valor contratado.',
    'Orcamento_Preliminar_Rede_ASAS_Brasil.xlsx — Resumo!B5:B7',
    'rascunho'
  ),
  (
    '2e9ddb97-0f37-4c4f-b82e-99dd50cc41de',
    'Novo prédio — composição do cenário-base preliminar',
    'Novo prédio',
    'O cenário-base distribui a estimativa entre fundação, estrutura, alvenaria e cobertura, instalações, acabamentos, acessibilidade, áreas externas, projetos e licenças, gestão e reserva técnica. Todos os itens dependem de quantitativos, cotações e validação técnica.',
    'Orcamento_Preliminar_Rede_ASAS_Brasil.xlsx — aba Orçamento por etapa',
    'rascunho'
  ),
  (
    '97424d67-cb81-46ea-ab43-b48ed68b0fee',
    'Novo prédio — limitações documentais do orçamento',
    'Novo prédio',
    'A estimativa não substitui orçamento executivo. A contratação deve ser precedida de levantamento quantitativo completo, cronograma físico-financeiro, cotações e validação pelo engenheiro responsável.',
    'Orcamento_Preliminar_Rede_ASAS_Brasil.xlsx — Resumo!A10 e Fontes e observações!A9',
    'rascunho'
  )
on conflict (id) do nothing;

