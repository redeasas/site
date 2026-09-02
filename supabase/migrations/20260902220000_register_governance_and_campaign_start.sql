-- Registros institucionais confirmados em 02/09/2026.
-- Não armazena CPF, RG, endereço residencial, assinatura ou imagem da ata.

insert into public.asas_knowledge_entries (title, category, content, source, status)
select item.title, item.category, item.content, item.source, 'rascunho'
from (values
  (
    'Identificação institucional confirmada',
    'Institucional',
    'O CNPJ informado pela instituição para a Rede ASAS Brasil é 01.160.544/0001-83.',
    'Confirmação institucional de 02/09/2026; cartão do CNPJ ainda será arquivado separadamente'
  ),
  (
    'Ata de eleição e posse — data oficial',
    'Governança',
    'A data institucional adotada para a ata de eleição e posse da diretoria é 16 de dezembro de 2025. O mandato registrado vai de 1º de janeiro de 2026 a 31 de dezembro de 2027.',
    'Ata 2026 atual.pdf; data confirmada pela instituição em 02/09/2026'
  ),
  (
    'Campanhas — marco inicial de arrecadação',
    'Doações',
    'A arrecadação recorrente da Campanha 1.000 ASAS e o controle da campanha do novo prédio ainda não foram iniciados. O marco inicial conciliado é R$ 0,00 e zero mantenedores recorrentes ativos.',
    'Declaração institucional de 02/09/2026'
  )
) as item(title, category, content, source)
where not exists (
  select 1 from public.asas_knowledge_entries existing where existing.title = item.title
);
