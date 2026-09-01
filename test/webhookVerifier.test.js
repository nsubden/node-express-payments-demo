import assert from "node:assert/strict";
import test from "node:test";
import {
  parsePaymentWebhook,
  signWebhookBody,
  verifyWebhookSignature
} from "../src/webhookVerifier.js";

test("verifies a signed webhook body", () => {
  const body = JSON.stringify({
    id: "evt_demo_1",
    type: "payment.succeeded",
    data: {
      orderId: "order_demo_1",
      paymentId: "pay_demo_1"
    }
  });
  const secret = "local-test-secret";
  const signature = signWebhookBody(body, secret);

  assert.equal(verifyWebhookSignature({ body, signature, secret }), true);
  assert.equal(verifyWebhookSignature({ body, signature: "bad", secret }), false);
});

test("parses supported payment webhook events", () => {
  const event = parsePaymentWebhook(JSON.stringify({
    id: "evt_demo_1",
    type: "payment.refunded",
    data: {
      orderId: "order_demo_1",
      paymentId: "pay_demo_1"
    }
  }));

  assert.deepEqual(event, {
    eventId: "evt_demo_1",
    orderId: "order_demo_1",
    paymentId: "pay_demo_1",
    nextStatus: "refunded"
  });
});
