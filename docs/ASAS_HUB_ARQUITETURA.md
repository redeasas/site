# ASAS HUB — fundação técnica

## Limite desta etapa

Esta fase prepara o banco e os contratos de segurança. Ela não cria usuários, não importa dados pessoais, não ativa cobrança e não conecta os protótipos públicos diretamente ao banco.

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

## Próximas ativações, em ordem

1. Criar o primeiro usuário administrador com MFA e política de recuperação.
2. Construir autenticação em domínio separado ou rota protegida, nunca no GitHub Pages estático.
3. Conectar o HUB à API com sessão e RLS; remover dados mock somente módulo a módulo.
4. Escolher gateway e validar assinatura dos webhooks antes de registrar eventos financeiros.
5. Criar política LGPD operacional: finalidade, retenção, exportação, correção e exclusão.
6. Executar revisão de segurança e homologação antes de uso real.
