# Ecossistema digital Rede ASAS Brasil

Site institucional, campanha 1.000 ASAS e protótipos de validação do ASAS HUB.

## Arquivos

- `index.html`: conteúdo completo da landing page.
- `styles.css`: layout responsivo, visual institucional e animações suaves.
- `script.js`: menu mobile, métricas consentidas, chatbot e envio seguro dos formulários.
- `supabase/`: banco protegido, retenção e função de captura dos contatos.
- `docs/OPERACAO_DO_SITE.md`: rotina interna de atendimento, segurança e manutenção.
- `dados-internos/`: modelos para validar impacto, obra e transparência antes da publicação.
- `assets/images/`: imagens, logos dos projetos e QR Code PIX.
- `asas-hub.html`: dashboard demonstrativo do ASAS HUB.
- `hub/`: telas internas demonstrativas (ficha 360°, CRM, financeiro, empresas, voluntários, impacto e IA).
- `minha-asa.html`: protótipo separado do portal privado do mantenedor.

## Segurança dos protótipos

As telas do ASAS HUB estão marcadas com `noindex,nofollow` e exibem somente dados fictícios. Elas não autenticam usuários, não realizam cobranças, não enviam mensagens e não substituem o backend com RBAC, trilha de auditoria e webhooks. Nenhuma tela interna deve ser usada operacionalmente antes dessas integrações e de uma revisão de segurança/LGPD.

## Doação

- PIX: `01.160.544/0001-83`
- Banco: Banco do Brasil
- Agência: `3495-9`
- Conta: `45335-8`

## Publicação no GitHub Pages

Envie para a raiz do repositório:

- `index.html`
- `styles.css`
- `script.js`
- `README.md`
- `assets`

Depois ative em `Settings > Pages`, usando branch `main` e pasta `/root`.
