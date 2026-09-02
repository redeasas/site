# Ecossistema digital Rede ASAS Brasil

Site institucional, campanha 1.000 ASAS e ASAS HUB protegido por autenticação, RLS e trilha de auditoria.

## Arquivos

- `index.html`: conteúdo completo da landing page.
- `styles.css`: layout responsivo, visual institucional e animações suaves.
- `script.js`: menu mobile, métricas consentidas, chatbot e envio seguro dos formulários.
- `supabase/`: banco protegido, retenção e função de captura dos contatos.
- `docs/OPERACAO_DO_SITE.md`: rotina interna de atendimento, segurança e manutenção.
- `dados-internos/`: modelos para validar impacto, obra e transparência antes da publicação.
- `assets/images/`: imagens, logos dos projetos e QR Code PIX.
- `asas-hub.html`: dashboard autenticado do ASAS HUB; em localhost exibe somente uma demonstração sem dados reais.
- `hub/`: módulos internos de mantenedores, CRM, financeiro, empresas, voluntários, impacto, IA, auditoria e usuários.
- `minha-asa.html`: protótipo separado do portal privado do mantenedor.

## Segurança do ASAS HUB

As telas estão marcadas com `noindex,nofollow`. Fora do ambiente local, exigem conta individual ativa e consultam o Supabase sob RLS. A navegação e as operações são limitadas por perfil, e alterações sensíveis geram auditoria. Cobranças continuam desativadas enquanto os segredos institucionais do Asaas não estiverem configurados; nenhum número completo de cartão ou CVV é armazenado.

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
