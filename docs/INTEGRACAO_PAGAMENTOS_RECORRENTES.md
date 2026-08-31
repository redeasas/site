# Integração de pagamentos recorrentes — Campanha 1.000 ASAS

## Estado atual

A infraestrutura está publicada, mas o checkout permanece **desativado**. Sem as credenciais e a homologação Sandbox, o endpoint responde `503 integration_not_configured` e nenhuma cobrança é criada.

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

