const VALID_TRANSITIONS = {
  created: new Set(["authorized", "failed", "canceled"]),
  authorized: new Set(["paid", "failed", "refunded"]),
  paid: new Set(["refunded"]),
  failed: new Set([]),
  canceled: new Set([]),
  refunded: new Set([])
};

export function createPaymentStore() {
  const orders = new Map();

  return {
    createOrder({ amount, currency }) {
      if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Order amount must be a positive integer.");
      }

      if (!/^[A-Z]{3}$/.test(currency)) {
        throw new Error("Currency must be a 3-letter ISO code.");
      }

      const order = {
        id: `order_demo_${orders.size + 1}`,
        amount,
        currency,
        status: "created",
        paymentId: null,
        updatedAt: new Date().toISOString()
      };

      orders.set(order.id, order);
      return order;
    },

    applyPaymentEvent({ orderId, paymentId, nextStatus }) {
      const order = orders.get(orderId);
      if (!order) {
        throw new Error("Order not found.");
      }

      const allowed = VALID_TRANSITIONS[order.status] || new Set();
      if (!allowed.has(nextStatus)) {
        throw new Error(`Cannot move order from ${order.status} to ${nextStatus}.`);
      }

      const updated = {
        ...order,
        status: nextStatus,
        paymentId,
        updatedAt: new Date().toISOString()
      };

      orders.set(orderId, updated);
      return updated;
    },

    getOrder(orderId) {
      return orders.get(orderId) || null;
    }
  };
}
