import assert from "node:assert/strict";
import test from "node:test";
import { createPaymentStore } from "../src/paymentState.js";

test("creates a fictional order and applies valid payment transitions", () => {
  const payments = createPaymentStore();
  const order = payments.createOrder({ amount: 2500, currency: "USD" });

  assert.equal(order.status, "created");

  const authorized = payments.applyPaymentEvent({
    orderId: order.id,
    paymentId: "pay_demo_1",
    nextStatus: "authorized"
  });

  assert.equal(authorized.status, "authorized");

  const paid = payments.applyPaymentEvent({
    orderId: order.id,
    paymentId: "pay_demo_1",
    nextStatus: "paid"
  });

  assert.equal(paid.status, "paid");
});

test("rejects invalid payment state transitions", () => {
  const payments = createPaymentStore();
  const order = payments.createOrder({ amount: 2500, currency: "USD" });

  assert.throws(() => {
    payments.applyPaymentEvent({
      orderId: order.id,
      paymentId: "pay_demo_1",
      nextStatus: "refunded"
    });
  }, /Cannot move order/);
});
