# ASAS HUB — fundação técnica

## Estado operacional

O banco, a autenticação, o controle por múltiplos perfis, o CRM, os cadastros, os fluxos de aprovação, a auditoria e a administração de usuários estão implantados. O modo demonstrativo existe apenas em localhost e não consulta dados reais.

Dependências externas permanecem bloqueadas por configuração segura: cobrança recorrente requer `ASAAS_API_KEY`, `ASAAS_ENVIRONMENT` e `ASAAS_WEBHOOK_TOKEN`; notificações por e-mail requerem `RESEND_API_KEY`, `LEAD_NOTIFICATION_TO` e remetente verificado. Indicadores e valores somente podem ser publicados depois de conciliação documental e aprovação administrativa.

## Perfis previstos

- `admin`: administração global e gestão de acessos.
- `financeiro`: mantenedores e eventos financeiros por referência do gateway.
- `relacionamento`: contatos, mantenedores, empresas e voluntariado.
- `projetos`: indicadores, impacto e conteúdo institucional.
- `auditoria`: leitura controlada e trilha de alterações.

O acesso é negado por padrão. Cada tabela usa RLS e a função `asas_has_role` para autorizar somente os perfis necessários.

## Fluxos

1. O formulário público continua entrando em `asas_leads` pela função protegida existente.
2. Após análise humana, um contato pode ser convertido em mantenedor, empresa ou voluntário.
3. O gateway enviará eventos idempotentes usando `gateway_event_id`; o banco não armazena cartão completo ou CVV.
4. Indicadores somente alimentam canais externos quando estiverem `publicado` e possuírem responsável, fonte, metodologia e aprovação.
5. A IA pública somente receberá conteúdo da visão `asas_public_knowledge`, preenchida por itens revisados e publicados.
6. Alterações nas entidades sensíveis geram registros em `asas_audit_log`.

## Controles implantados

1. Conta individual, recuperação de senha e expiração de sessão.
2. Autorização no banco com RLS e negação por padrão.
3. Múltiplos perfis por usuário e suspensão administrativa de acesso.
4. Trilha de auditoria para entidades sensíveis.
5. Funil único para contatos recebidos pelo site.
6. Conteúdo e indicadores com rascunho, validação, aprovação e publicação.
7. Webhook financeiro idempotente e armazenamento apenas de referências do gateway.
