# Ecossistema Digital Rede ASAS — Arquitetura e Wireframes v1

**Status:** proposta para aprovação; nenhuma implementação nesta etapa.  
**Data:** 31 de agosto de 2026.  
**Hierarquia:** Rede ASAS é protagonista; 1.000 ASAS é a campanha recorrente; IA ASAS é a ponte; ASAS HUB é a gestão.

## 1. Diagnóstico atual

### Preservar

- narrativa institucional de 30 anos;
- história, território, projetos, impacto e histórias;
- separação entre dados confirmados e indicadores em validação;
- novo prédio com documentação, orçamento preliminar e campanha própria;
- transparência, governança e integridade;
- caminhos para empresas, voluntariado, visita e apoio;
- SEO local para Taquaril e Belo Horizonte.

### Resolver

- as formas de participação estão fragmentadas em várias páginas;
- não existe recorrência como produto e jornada completa;
- o atendimento atual usa opções fixas, sem conversa livre baseada em conhecimento aprovado;
- site e gestão não compartilham fonte única de campanhas, projetos e indicadores;
- não há Minha ASA nem CRM integrado;
- manutenção institucional e novo prédio precisam de segregação financeira absoluta;
- campos incompletos não podem ser preenchidos por inferência.

## 2. Decisões de produto

1. A Home continua institucional; conhecer vem antes de contribuir.
2. `/1000-asas` será a campanha recorrente e a principal porta da Central de Apoio.
3. `/apoie` será mantida durante a transição, sem quebrar URLs existentes.
4. Novo prédio terá campanha, doadores, materiais, saldo e relatórios separados.
5. A IA pública só usa conteúdo aprovado; quando não souber, registra a pergunta.
6. O contador público mostrará somente mantenedores ativos conciliados.
7. Pagamento só será confirmado por webhook validado e conciliação.
8. O ASAS HUB terá controle por função e escopo.
9. CPF será coletado apenas quando houver finalidade definida.
10. O MVP será operacional e seguro; automações avançadas entram depois.

## 3. Sitemap proposto

```text
/
├── /quem-somos
├── /projetos
│   └── /projetos/{slug}
├── /impacto
├── /historias
├── /novo-predio
├── /transparencia
│   ├── /relatorios
│   ├── /governanca
│   └── /integridade
├── /1000-asas
│   ├── /1000-asas/participar
│   └── /1000-asas/perguntas
├── /apoie
│   ├── /doacao-unica
│   ├── /empresas
│   ├── /voluntariado
│   ├── /materiais
│   ├── /visita
│   └── /outras-formas
├── /minha-asa
├── /privacidade
└── /contato
```

Menu principal: **Início · Quem somos · Projetos · Impacto · Histórias · Novo prédio · Transparência · 1.000 ASAS**.

## 4. Wireframe textual — Home

```text
┌────────────────────────────────────────────────────────────┐
│ FAIXA: Rede ASAS · Desde 1996 | Instagram | WhatsApp      │
├────────────────────────────────────────────────────────────┤
│ LOGO       MENU INSTITUCIONAL              [1.000 ASAS]   │
├────────────────────────────────────────────────────────────┤
│ HERO INSTITUCIONAL                                         │
│ 30 anos transformando oportunidades em futuro              │
│ Texto sobre atuação no Taquaril                            │
│ [Conheça nosso impacto] [Descubra como fazer parte]         │
│ Foto real aprovada                                         │
├────────────────────────────────────────────────────────────┤
│ PROVA DE CONFIANÇA                                         │
│ 30 anos | dados com fonte | transparência | atuação local   │
├────────────────────────────────────────────────────────────┤
│ CONHEÇA A REDE ASAS                                       │
│ História curta + imagem real + [Nossa história]             │
├────────────────────────────────────────────────────────────┤
│ PROJETOS                                                   │
│ Educação | Esporte | Cultura e tecnologia | Famílias        │
├────────────────────────────────────────────────────────────┤
│ HISTÓRIAS REAIS                                            │
│ depoimentos autorizados + [Conhecer histórias]              │
├────────────────────────────────────────────────────────────┤
│ IMPACTO COM RESPONSABILIDADE                               │
│ somente indicadores aprovados + período + fonte             │
├────────────────────────────────────────────────────────────┤
│ NOVO PRÉDIO                                                │
│ perspectiva marcada como projeto futuro + resumo técnico    │
│ [Conhecer projeto] [Apoiar construção]                      │
├────────────────────────────────────────────────────────────┤
│ DESCUBRA COMO FAZER PARTE                                  │
│ 1.000 ASAS | empresa | voluntariado | materiais | visita    │
├────────────────────────────────────────────────────────────┤
│ TRANSPARÊNCIA + RODAPÉ COMPLETO                            │
└────────────────────────────────────────────────────────────┘
                         [◉ Posso ajudar?]
```

Mobile: uma coluna; botões grandes; vídeo após interação; IA sem cobrir CTAs; menu com acesso direto à campanha.

## 5. Wireframe textual — 1.000 ASAS

```text
┌────────────────────────────────────────────────────────────┐
│ HERO: CAMPANHA 1.000 ASAS                                 │
│ 1.000 pessoas. Milhares de histórias.                       │
│ A partir de R$ 10 por mês                                  │
│ [Quero ser uma das 1.000 ASAS] + foto real                 │
├────────────────────────────────────────────────────────────┤
│ PROGRESSO CONCILIADO                                       │
│ [237 ativas] [faltam 763] █████░░░░ 23,7%                  │
│ data e critério de atualização                             │
│ sem validação: “contador em implantação”                    │
├────────────────────────────────────────────────────────────┤
│ POR QUE 1.000 ASAS?                                        │
│ “Não precisamos que poucos façam muito...”                  │
├────────────────────────────────────────────────────────────┤
│ ESCOLHA: [R$10] [R$20] [R$30] [R$50] [Outro]               │
│ periodicidade mensal explícita + [Continuar]                │
├────────────────────────────────────────────────────────────┤
│ O QUE SUA ASA FORTALECE                                    │
│ Educação | Esporte | Cultura | Famílias | Estrutura         │
├────────────────────────────────────────────────────────────┤
│ COMO FUNCIONA                                              │
│ escolher → cadastrar → pagar → acompanhar                   │
├────────────────────────────────────────────────────────────┤
│ HISTÓRIAS + PRESTAÇÃO DE CONTAS + TRANSPARÊNCIA            │
├────────────────────────────────────────────────────────────┤
│ FAQ + CTA FINAL                                            │
├────────────────────────────────────────────────────────────┤
│ OUTRAS FORMAS: única | empresa | material | voluntariado    │
└────────────────────────────────────────────────────────────┘
                            [◉ IA ASAS]
```

Fluxo: valor → dados mínimos → consentimentos → gateway → webhook → ativação da ASA → Minha ASA. O número da ASA só nasce após confirmação financeira.

Estados: contador indisponível, pagamento pendente, confirmado, recusado, gateway indisponível, cadastro existente, adesão interrompida, pausa e cancelamento.

## 6. Wireframe — IA ASAS pública

```text
[◉ Posso ajudar?]
┌─────────────────────────────────────┐
│ IA ASAS — assistente virtual    [x] │
├─────────────────────────────────────┤
│ Saudação contextual à página        │
│ [Conhecer a Rede] [Projetos]         │
│ [Quero ajudar] [Voluntariado]        │
│ [Empresa] [Tenho uma dúvida]         │
│                                     │
│ Histórico da conversa               │
├─────────────────────────────────────┤
│ Digite sua mensagem...       [Enviar]│
│ Conteúdo institucional aprovado     │
└─────────────────────────────────────┘
```

Fluxo: detectar página e intenção → buscar conteúdo aprovado → responder com referência → oferecer página, fluxo, lead ou registro de pergunta.

Guardrails: identificar-se como IA; não inventar números, horários ou vagas; não pedir CPF, banco ou dados de crianças; explicar finalidade antes de dados pessoais; não prometer retorno imediato; WhatsApp somente por escolha do visitante.

## 7. Wireframe — Dashboard ASAS HUB

```text
┌──────────────┬─────────────────────────────────────────────┐
│ MENU         │ Olá, [nome]       período [este mês ▼]     │
│ Visão geral  ├─────────────────────────────────────────────┤
│ 1.000 ASAS   │ 237/1000 | MRR | recebido | pendente       │
│ CRM          │ novos | cancelamentos | ticket médio        │
│ Pagamentos   ├─────────────────────────────────────────────┤
│ Empresas     │ GRÁFICOS: mantenedores e receita            │
│ Voluntários  ├─────────────────────────────────────────────┤
│ Materiais    │ FUNIL: visita → IA → lead → adesão → pago   │
│ Impacto      ├─────────────────────────────────────────────┤
│ Comunicação  │ AÇÕES: falhas | follow-ups | dúvidas IA     │
│ IA           ├─────────────────────────────────────────────┤
│ Relatórios   │ ATIVIDADE RECENTE / AUDITORIA               │
│ Configuração │                                             │
└──────────────┴─────────────────────────────────────────────┘
```

Cada cartão informa definição e período. Receita confirmada nunca se mistura com pendências. A visão muda conforme a permissão.

## 8. Wireframe — Ficha do mantenedor

```text
┌────────────────────────────────────────────────────────────┐
│ ASA #0237 · Maria Silva       [Ativa] [Ações permitidas ▼]│
│ Desde 12/08/2026 · origem Instagram · responsável Ana      │
├────────────────────────────────────────────────────────────┤
│ R$30/mês | total confirmado | próximo pagamento            │
├────────────────────────────────────────────────────────────┤
│ Visão | Pagamentos | Relacionamento | Consentimentos       │
│ Indicações | Auditoria                                    │
├────────────────────────────────────────────────────────────┤
│ Contato e tags          │ Plano, método e situação          │
├────────────────────────────────────────────────────────────┤
│ LINHA DO TEMPO: pagamento | conversa | e-mail | nota       │
├────────────────────────────────────────────────────────────┤
│ PRÓXIMA AÇÃO + responsável + vencimento                    │
└────────────────────────────────────────────────────────────┘
```

Alterar valor, cancelar, exportar ou modificar informação financeira exige permissão, motivo, confirmação e log.

## 9. Wireframe — CRM

```text
FILTROS: responsável | origem | interesse | período | campanha
BUSCA: nome, empresa, e-mail ou telefone

┌────────────┬────────────┬─────────────┬────────────┬──────────┐
│Não contat. │ Contatado  │ Interessado │ Aguardando │Convertido│
│ cards      │ cards      │ cards       │ cards      │ cards    │
└────────────┴────────────┴─────────────┴────────────┴──────────┘

CARD: nome | interesse | origem | responsável | próxima ação
PAINEL: dados | histórico | notas | consentimentos | tarefas
```

Uma pessoa é única no sistema e pode possuir vários interesses e oportunidades; não será duplicada para cada formulário.

## 10. Wireframe — Minha ASA

```text
┌────────────────────────────────────────────────────────────┐
│ Olá, Maria. Você é a ASA #0237. [Contribuição ativa]       │
├────────────────────────────────────────────────────────────┤
│ R$30/mês | desde ago/2026 | total confirmado               │
├────────────────────────────────────────────────────────────┤
│ O QUE SUAS ASAS FIZERAM ESTE MÊS                           │
│ resumo aprovado + indicadores com fonte + história          │
├────────────────────────────────────────────────────────────┤
│ Contribuições | Alterar valor | Pagamento | Indicações      │
│ Dados pessoais | Preferências | Ajuda                      │
├────────────────────────────────────────────────────────────┤
│ Histórico de pagamentos e recibos disponíveis              │
└────────────────────────────────────────────────────────────┘
```

Regras: autenticação segura; somente dados do titular; alterações financeiras pelo gateway; cancelamento claro; total apenas confirmado; impacto institucional sem prometer destinação individual.

## 11. Arquitetura técnica

```text
SITE PÚBLICO / MINHA ASA / ASAS HUB
              │
              ▼
       CAMADA DE APLICAÇÃO
  autenticação · APIs · validação · RBAC
       │          │          │
       ▼          ▼          ▼
 PostgreSQL    Fila/Jobs   Armazenamento
 + RLS         e eventos   público/privado
       │
       ├── gateway de pagamento + webhooks assinados
       ├── e-mail transacional
       ├── WhatsApp Business oficial [futuro]
       ├── IA ASAS + base aprovada
       └── GA4 consentido + analytics interno
```

Recomendação: Next.js/TypeScript; PostgreSQL/Supabase com RLS; arquivos privados por padrão; adaptador de gateway; RAG com conteúdo aprovado; fila para webhooks e automações; ambientes dev, staging e produção; implantação paralela ao WordPress e rollback.

Fronteiras: site público não acessa tabelas administrativas; navegador não recebe segredos; webhook valida assinatura, valor e idempotência; IA pública não consulta financeiro; IA interna herda permissões; prédio e manutenção usam centros de custo distintos.

## 12. Banco de dados

### Identidade e acesso

`users`, `roles`, `permissions`, `user_roles`, `role_permissions`, `audit_logs`.

### Pessoas e CRM

`people`, `person_contacts`, `consents`, `leads`, `lead_interests`, `tags`, `person_tags`, `followups`, `notes`, `activities`, `organizations`, `organization_contacts`, `opportunities`.

### Campanhas e pagamentos

`campaigns`, `campaign_public_metrics`, `donor_profiles`, `recurring_agreements`, `donations`, `payments`, `payment_events`, `refunds`, `referrals`, `captor_assignments`.

### Impacto e conhecimento

`projects`, `project_updates`, `impact_metrics`, `impact_observations`, `evidence_files`, `stories`, `media_assets`, `monthly_impact_reports`, `knowledge_articles`, `knowledge_versions`, `knowledge_sources`, `knowledge_approvals`.

### Operação

`volunteer_profiles`, `volunteer_applications`, `material_offers`, `material_offer_items`, `conversations`, `messages`, `conversation_intents`, `communications`, `communication_deliveries`, `automation_rules`, `automation_runs`, `settings`.

Regras: UUID público; UTC; unicidade de eventos externos; índices em contato/status/responsável/campanha/data; logs imutáveis; financeiro corrigido por lançamento compensatório; contadores derivados de visão aprovada.

## 13. Estrutura de pastas

```text
apps/
├── web/                 site e 1.000 ASAS
├── hub/                 administração
└── portal/              Minha ASA
packages/
├── ui/                  design system
├── domain/              regras de negócio
├── auth/                autenticação e RBAC
├── database/            schema, migrações e RLS
├── payments/            gateways e webhooks
├── ai/                  RAG, políticas e avaliações
├── analytics/           eventos e atribuição
├── communications/      e-mail e WhatsApp
└── validation/          validação server-side
services/
├── worker/              filas e automações
└── webhook-ingress/     entrada isolada
content/
├── institutional/
└── knowledge-base/
infra/
├── environments/
├── monitoring/
└── backups/
docs/
├── architecture/
├── privacy-security/
└── product/
```

## 14. Principais riscos e controles

| Risco | Controle |
|---|---|
| contador sem conciliação | publicar somente ativos confirmados e data |
| mistura prédio/manutenção | campanhas e centros de custo separados |
| webhook duplicado/fraudado | assinatura, idempotência, valor e auditoria |
| IA inventar | RAG aprovado, fonte, recusa e escalonamento |
| IA interna ultrapassar acesso | autorização antes da consulta |
| coleta excessiva de CPF | minimização e finalidade explícita |
| pessoas duplicadas | cadastro mestre e contatos normalizados |
| disparos indevidos | consentimento por canal e supressão |
| depoimentos sem autorização | registro de autorização e retirada |
| conta administrativa comprometida | 2FA, RBAC e sessão segura |
| dependência de gateway | camada adaptadora independente |
| migração quebrar site | staging, implantação paralela e rollback |
| impacto sem metodologia | fonte, período, responsável e aprovação |
| logs com dados sensíveis | mascaramento e retenção definida |

## 15. MVP recomendado

- site institucional preservado;
- página 1.000 ASAS;
- adesão recorrente;
- CRM único para formulários e IA;
- mantenedores, pagamentos e webhooks;
- dashboard essencial;
- base institucional aprovada;
- IA pública com escalonamento;
- consentimentos, auditoria e RBAC;
- contador público conciliado.

Empresas, voluntariado e materiais entram no mesmo CRM desde o início, mas os módulos operacionais completos ficam para a fase seguinte.

## 16. Decisões antes de programar

1. Aprovar `/1000-asas` ou `/1000asas` — recomendação: `/1000-asas`.
2. Aprovar o critério: ASA ativa = acordo recorrente com ao menos um pagamento confirmado.
3. Escolher gateway após comparar PIX Automático, cartão, webhook, taxas e suporte.
4. Confirmar valores, mínimo, pausa, alteração e cancelamento.
5. Nomear aprovadores de conteúdo da IA e indicadores.
6. Definir responsável LGPD e retenção.
7. Decidir se Minha ASA entra no MVP.
8. Validar autorizações de depoimentos e imagens, especialmente de crianças.
9. Aprovar convivência/migração do WordPress e rollback.

## 17. Gate de implementação

Nenhum desenvolvimento começa antes da aprovação explícita do sitemap, Home, 1.000 ASAS, IA ASAS, Dashboard, ficha do mantenedor, CRM, Minha ASA, arquitetura, segurança, modelo de dados e regras financeiras/privacidade.

