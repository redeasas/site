# Migração de redeasas.org.br para o novo site

## Estado

Preparação concluída sem alteração do domínio. Não publicar esta branch antes da janela de migração.

## Antes da janela

- [ ] Confirmar acesso administrativo à Hostinger e ao WordPress.
- [ ] Gerar backup integral no hPanel: arquivos, banco de dados e e-mails/configurações aplicáveis.
- [ ] Baixar o backup e confirmar que o arquivo pode ser aberto.
- [ ] Registrar a configuração DNS atual: NS, A, AAAA, CNAME, MX, TXT, SPF e DMARC.
- [ ] Confirmar que `contato@redeasas.org.br` recebe e envia mensagens.
- [ ] Publicar e testar a Edge Function com os três domínios autorizados.
- [ ] Gerar o pacote público com `scripts/package-hostinger.sh`.
- [ ] Testar o pacote em uma pasta ou subdomínio de homologação da Hostinger.

## Troca recomendada na Hostinger

1. Ativar uma página curta de manutenção.
2. Mover a instalação WordPress existente para uma pasta de backup não pública ou restaurável pelo hPanel.
3. Extrair apenas o pacote público na pasta do domínio.
4. Confirmar que `.htaccess` foi extraído.
5. Testar página inicial, páginas internas, imagens, PIX, WhatsApp e formulários.
6. Testar todas as URLs antigas do mapa de redirecionamento e confirmar HTTP 301.
7. Desativar a manutenção.

Não alterar os nameservers nem os registros MX/TXT do e-mail nesta estratégia.

## Depois da troca

- [ ] Cadastrar `https://redeasas.org.br/` no Search Console.
- [ ] Enviar `https://redeasas.org.br/sitemap.xml`.
- [ ] Confirmar recebimento no Google Analytics `G-XJ3L8N2SCW`.
- [ ] Testar o formulário com um registro identificado e removê-lo após a validação.
- [ ] Verificar HTTPS, `www` → domínio principal, página 404 e cabeçalhos de segurança.
- [ ] Acompanhar erros 404 e formulários diariamente por sete dias.
- [ ] Manter o backup do WordPress por no mínimo 90 dias.

## Reversão

Se houver falha relevante, recolocar os arquivos do WordPress e restaurar o banco pelo hPanel. Como o DNS e o e-mail não serão alterados, a reversão fica restrita à hospedagem do site.

