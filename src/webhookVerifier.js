import { createHmac, timingSafeEqual } from "node:crypto";

export function signWebhookBody(body, secret) {
  return createHmac("sha256", secret).update(body).digest("hex");
}

export function verifyWebhookSignature({ body, signature, secret }) {
  if (!body || !signature || !secret) {
    return false;
  }

  const expected = signWebhookBody(body, secret);
  const receivedBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(receivedBuffer, expectedBuffer);
}

export function parsePaymentWebhook(body) {
  const event = JSON.parse(body);

  if (!event.id || !event.type || !event.data) {
    throw new Error("Webhook event is missing required fields.");
  }

  const statusByType = {
    "payment.authorized": "authorized",
    "payment.succeeded": "paid",
    "payment.failed": "failed",
    "payment.refunded": "refunded"
  };

  const nextStatus = statusByType[event.type];
  if (!nextStatus) {
    throw new Error("Unsupported webhook event type.");
  }

  return {
    eventId: event.id,
    orderId: event.data.orderId,
    paymentId: event.data.paymentId,
    nextStatus
  };
}
