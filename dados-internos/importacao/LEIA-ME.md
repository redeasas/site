# Importação controlada do ASAS HUB

Estes modelos servem para preparar futuras cargas oficiais. Linhas de exemplo ficam vazias de propósito e não devem ser importadas.

## Regras obrigatórias

1. Preencher apenas informações presentes em cadastro, contrato, comprovante, formulário com consentimento ou outra fonte institucional verificável.
2. Não completar lacunas com Instagram, memória, estimativas ou informações que apenas pareçam plausíveis.
3. Manter a coluna `fonte_documental` para permitir conferência antes da carga.
4. Importar somente após revisão do responsável pelo setor.
5. Dados financeiros entram apenas por conciliação ou evento do gateway; nunca por estimativa manual.
6. Indicadores de impacto permanecem em `rascunho` ou `em_validacao` até que período, metodologia, fonte e responsável estejam preenchidos.
7. Não armazenar número completo de cartão, CVV, senha, documento desnecessário ou dado pessoal sem finalidade definida.

## Situação da primeira carga

- Mantenedores: nenhuma lista documental fornecida.
- Empresas: nenhuma lista documental fornecida.
- Voluntários: nenhuma lista documental fornecida.
- Pagamentos e arrecadação: nenhum extrato conciliado ou retorno de gateway fornecido.
- Indicadores de impacto: estrutura existente, valores ainda pendentes.
- Novo prédio: orçamento preliminar cadastrado somente na base interna de conhecimento, com status `rascunho` e limitações explícitas.

