export function createIdempotencyStore() {
  const processedEvents = new Map();

  return {
    has(eventId) {
      return processedEvents.has(eventId);
    },

    save(eventId, result) {
      processedEvents.set(eventId, {
        result,
        processedAt: new Date().toISOString()
      });
      return processedEvents.get(eventId);
    },

    get(eventId) {
      return processedEvents.get(eventId);
    }
  };
}
