import http from "node:http";
import { createIdempotencyStore } from "./idempotencyStore.js";
import { createPaymentStore } from "./paymentState.js";
import { parsePaymentWebhook, verifyWebhookSignature } from "./webhookVerifier.js";

const port = Number.parseInt(process.env.PORT || "3001", 10);
const webhookSecret = process.env.WEBHOOK_SECRET || "local-demo-secret";
const payments = createPaymentStore();
const idempotency = createIdempotencyStore();

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 64_000) {
        reject(new Error("Request body is too large."));
        request.destroy();
      }
    });

    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

async function handleRequest(request, response) {
  try {
    if (request.method === "POST" && request.url === "/orders") {
      const body = await readBody(request);
      const payload = JSON.parse(body || "{}");
      const order = payments.createOrder(payload);
      return sendJson(response, 201, { order });
    }

    if (request.method === "POST" && request.url === "/webhooks/payments") {
      const body = await readBody(request);
      const signature = request.headers["x-demo-signature"];
      const verified = verifyWebhookSignature({
        body,
        signature,
        secret: webhookSecret
      });

      if (!verified) {
        return sendJson(response, 401, { error: "Invalid webhook signature." });
      }

      const event = parsePaymentWebhook(body);
      if (idempotency.has(event.eventId)) {
        return sendJson(response, 200, {
          duplicate: true,
          result: idempotency.get(event.eventId).result
        });
      }

      const order = payments.applyPaymentEvent(event);
      idempotency.save(event.eventId, { orderId: order.id, status: order.status });
      return sendJson(response, 200, { duplicate: false, order });
    }

    return sendJson(response, 404, { error: "Route not found." });
  } catch (error) {
    return sendJson(response, 400, { error: error.message });
  }
}

if (process.env.NODE_ENV !== "test") {
  http.createServer(handleRequest).listen(port, () => {
    console.log(`Payment demo API listening on http://localhost:${port}`);
  });
}

export { handleRequest };
