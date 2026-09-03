# Integração de pagamentos recorrentes — Campanha 1.000 ASAS

## Estado atual

A infraestrutura e as credenciais de Sandbox estão configuradas. O endpoint criou checkout hospedado com sucesso e o webhook autenticado respondeu corretamente. O checkout permanece disponível somente na URL privada de homologação (`/1000-asas?validacao=121`); no acesso público comum, o formulário continua registrando interesse sem criar cobrança.

## Provedor preparado

Asaas Checkout recorrente, usando página hospedada para que o site da Rede ASAS nunca receba número completo de cartão ou CVV.

## Segredos necessários no Supabase

- `ASAAS_ENVIRONMENT`: começar com `sandbox`; mudar para `production` somente após homologação.
- `ASAAS_API_KEY`: chave do ambiente correspondente.
- `ASAAS_WEBHOOK_TOKEN`: token exclusivo de 32 a 255 caracteres. Não reutilizar a chave da API.

## Webhook

URL: `https://yljvlllrvibyongccgmz.supabase.co/functions/v1/payment-webhook`

Configurar apenas os eventos necessários de checkout, assinatura e cobrança. O Asaas deve enviar o token no cabeçalho `asaas-access-token`.

## Regras implementadas

1. Retorno do navegador não confirma pagamento.
2. Somente webhook autenticado registra evento financeiro.
3. Eventos duplicados são ignorados pelo identificador idempotente.
4. A ASA é numerada e ativada somente após `PAYMENT_CONFIRMED` ou `PAYMENT_RECEIVED`.
5. Estimativas, checkout criado e cobrança pendente não entram no contador público.
6. O banco não armazena dados completos de cartão ou CVV.
7. Produção só deve ser habilitada depois de testes de criação, pagamento, falha, duplicidade, cancelamento e estorno no Sandbox.

## Validações concluídas

- Credenciais Sandbox armazenadas como segredos no Supabase.
- Checkout recorrente criado com sucesso usando página hospedada pelo Asaas.
- Webhook salvo no Asaas e autenticação do token validada.
- Dados de cartão, CPF e endereço não passam pelo site da Rede ASAS.

## Pendências antes de produção

- Concluir cadastro e análise documental da conta Asaas de produção.
- Executar o ciclo completo no Sandbox: confirmação, duplicidade, inadimplência, cancelamento e estorno.
- Conferir conciliação e numeração das ASAS no painel interno.
- Trocar a chave e o ambiente para produção somente após aceite formal da homologação.
