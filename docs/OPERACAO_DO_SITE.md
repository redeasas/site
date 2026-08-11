# Operação do site — Rede ASAS Brasil

Este documento é interno. Ele define a rotina mínima para que contatos, dados públicos e serviços não fiquem sem acompanhamento.

## Contatos recebidos

1. Acesse o projeto **Rede ASAS Brasil** no Supabase e abra `Table Editor > asas_leads`.
2. Filtre `status = novo` no início e no fim de cada dia útil.
3. Ao assumir um contato, altere para `em_atendimento`, preencha `assigned_to` e `last_contacted_at`.
4. Após a resposta ou solução, altere para `concluido`. Marque como `spam` somente quando confirmado.
5. Nunca exporte a lista para computadores pessoais ou compartilhe dados em grupos.
6. Pedidos de correção ou exclusão recebidos em `contato@redeasas.org.br` devem ser registrados e atendidos pela direção.

Meta operacional recomendada: primeira resposta em até dois dias úteis.

## Retenção e acesso

- O prazo padrão é de 24 meses a partir do cadastro.
- A finalidade encerrada ou um pedido válido de exclusão pode exigir remoção antecipada.
- Somente direção e pessoas formalmente autorizadas devem ter acesso ao Supabase.
- Revise trimestralmente usuários, autenticação em dois fatores e acessos ao GitHub, Google e Supabase.
- A rotina automática chama `purge_expired_asas_leads()` diariamente às 03h15 UTC. Confira trimestralmente o histórico em `cron.job_run_details` no SQL Editor do Supabase.

## Publicação e saúde do site

- O GitHub Pages publica a branch `main` do repositório `redeasas/site`.
- O fluxo `Site health` verifica semanalmente páginas, arquivos de busca e o endpoint seguro de contato.
- Falha no fluxo deve ser investigada no mesmo dia útil.
- Teste mensalmente o QR Code PIX em dois celulares e confirme beneficiário e finalidade antes de qualquer alteração.

## Google

- Analytics: propriedade **Site Rede ASAS Brasil**, ID `G-XJ3L8N2SCW`.
- Search Console: propriedade `https://redeasas.github.io/site/`.
- Revise mensalmente páginas indexadas, erros, origem de tráfego e eventos `lead_submit`/`lead_success`.
- Não altere números de impacto com base apenas no Analytics; ele mede uso do site, não atendimento social.

## Conteúdo institucional

- Atualize notícias ao menos mensalmente, quando houver material autorizado.
- Registre fonte, período e responsável antes de publicar métricas.
- Mantenha a transparência em rascunho até receber os documentos oficiais e autorização da direção.
- No novo prédio, publique arrecadação, etapa, cronograma e fotos somente após conciliação documental.

## Incidentes

Se houver suspeita de vazamento, PIX divergente, página fraudulenta ou acesso indevido: preserve evidências, suspenda o acesso comprometido, informe imediatamente a direção e não publique detalhes pessoais no GitHub.
