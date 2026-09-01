# Node Express Payments Demo

A compact payment workflow demo showing webhook verification, idempotency,
order/payment state transitions, error handling, environment configuration,
and tests.

This repository uses fictional data only. It does not include real payment
keys, customer information, production infrastructure, or proprietary code.

## Demonstrated skills

- Stripe-style webhook HMAC verification
- Idempotent webhook event handling
- Order and payment state transitions
- Defensive JSON API responses
- Environment-based configuration
- Automated tests with Node.js test runner

## Run locally

Requires Node.js 20 or newer.

```sh
cp .env.example .env
export WEBHOOK_SECRET="choose-a-local-value"
npm test
npm start
```

Create a fictional order:

```sh
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{"amount":1999,"currency":"USD"}'
```

The webhook logic is in `src/webhookVerifier.js` and
`src/paymentState.js`. It demonstrates the patterns without processing real
payments.

## Security boundaries

- All order IDs, payment IDs, events, and amounts are fictional.
- `.env` and common key formats are ignored by Git.
- The example never logs request bodies, signatures, or credentials.
- No real payment provider SDK is included.
- This repository is not connected to any production environment.

See `SECURITY.md` before adapting this example.
