import assert from "node:assert/strict";
import test from "node:test";
import { createIdempotencyStore } from "../src/idempotencyStore.js";

test("stores processed webhook events by id", () => {
  const store = createIdempotencyStore();

  assert.equal(store.has("evt_demo_1"), false);

  store.save("evt_demo_1", { status: "paid" });

  assert.equal(store.has("evt_demo_1"), true);
  assert.deepEqual(store.get("evt_demo_1").result, { status: "paid" });
});
