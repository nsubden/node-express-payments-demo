# Node Express Payments Demo

A compact **Node.js + Express** payment workflow demo focused on safe backend patterns for payment processing, webhook verification, idempotency, state management, validation, error handling, environment configuration, and automated testing.

This repository uses **fictional data only**. It does not contain real payment credentials, customer information, production infrastructure, or proprietary application code.

## What this project demonstrates

This demo is designed to show practical backend patterns commonly used in payment, ecommerce, and marketplace systems:

- Webhook signature verification using HMAC
- Idempotent webhook event processing
- Explicit order and payment state transitions
- Request validation
- Defensive JSON API responses
- Environment-based configuration
- Automated tests using the Node.js test runner
- Secret-safe development practices
- Production-oriented error handling

## Architecture

The project is intentionally small and easy to review.

### Request validation

Incoming API requests are validated before they are allowed to create or modify application state.

### Webhook verification

Webhook requests are authenticated using an HMAC signature before any event is processed.

This demonstrates the same general security pattern used by many payment providers without connecting the project to a real payment account.

### Idempotency

Processed webhook event IDs are tracked so the same event cannot be applied more than once.

This protects the payment workflow from duplicate event delivery and repeated state changes.

### Payment state transitions

Payment state changes are handled explicitly rather than updated arbitrarily.

Invalid transitions are rejected to protect order and payment consistency.

Example lifecycle:
```text
pending
  ↓
paid
  ↓
refunded
