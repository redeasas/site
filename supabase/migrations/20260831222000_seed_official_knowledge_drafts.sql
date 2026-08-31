-- Base inicial da IA derivada exclusivamente do conteúdo oficial já publicado.
-- Todos os itens permanecem em rascunho e exigem validação administrativa.

insert into public.asas_knowledge_entries (title, category, content, source, status)
select item.title, item.category, item.content, item.source, 'rascunho'
from (values
  (
    'Identidade institucional e território',
    'Institucional',
    'A Rede ASAS Brasil atua desde 1996 no Taquaril, em Belo Horizonte, com frentes de educação, esporte, cultura, tecnologia e fortalecimento familiar. O CNPJ institucional informado no site é 01.160.544/0001-83.',
    'https://redeasas.org.br/ e https://redeasas.org.br/quem-somos'
  ),
  (
    'Canais oficiais de atendimento',
    'Contatos',
    'O WhatsApp oficial publicado é (31) 98960-8865. O endereço publicado é Rua Alair Pereira da Silva, 205, Taquaril, Belo Horizonte, MG, CEP 30290-580. Solicitações devem ser encaminhadas conforme o assunto e nunca devem incluir senhas ou dados completos de cartão.',
    'https://redeasas.org.br/ e configuração institucional vigente do site'
  ),
  (
    'Como apoiar com segurança por PIX',
    'Doações',
    'A chave PIX publicada para apoio ao novo prédio é o CNPJ 01.160.544/0001-83. Antes de confirmar, a pessoa deve conferir no aplicativo bancário o nome do beneficiário. A recorrência automática ainda não está ativa no site.',
    'https://redeasas.org.br/apoie'
  ),
  (
    'Projetos — limites das informações disponíveis',
    'Projetos',
    'As frentes publicadas incluem educação, esporte, cultura, tecnologia e fortalecimento familiar. Faixas etárias, vagas, frequência, horários, locais e critérios de participação continuam em atualização e não devem ser inventados pela assistente.',
    'https://redeasas.org.br/projetos'
  ),
  (
    'Indicadores de impacto — regra de resposta',
    'Impacto',
    'Indicadores sem relatório, período fechado, base de registros e metodologia documentada não devem ser apresentados como resultados consolidados. Pessoas únicas, atendimentos, matrículas e participações precisam ser diferenciados.',
    'https://redeasas.org.br/impacto'
  ),
  (
    'Novo prédio — situação documental',
    'Novo prédio',
    'O material publicado registra 17 pranchas estruturais, fundações previstas com 17 tubulões de 70 cm e 6 estacas de 60 cm, sondagem com dois furos e estimativa preliminar de R$ 3.321.980,35 para aproximadamente 640 m². Esses dados pertencem ao projeto e não comprovam execução, arrecadação ou orçamento executivo fechado.',
    'https://redeasas.org.br/novo-predio e documentos técnicos internos citados na página'
  )
) as item(title, category, content, source)
where not exists (
  select 1 from public.asas_knowledge_entries existing where existing.title = item.title
);
