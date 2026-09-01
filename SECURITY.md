# Security Policy

This repository is a public demonstration project. It is intentionally
separate from production applications.

## What belongs here

- Fictional orders and webhook events
- Placeholder environment variables
- Small examples of API, webhook, and state-management patterns
- Tests that use local-only secrets

## What must not be committed

- Real `.env` files
- API keys, webhook secrets, access tokens, or private keys
- Customer data or order history
- Production URLs, database strings, deployment scripts, or infrastructure
  diagrams
- Proprietary marketplace source code

If you adapt this pattern for a real project, store secrets in a proper secret
manager and verify webhook signatures before changing payment state.
