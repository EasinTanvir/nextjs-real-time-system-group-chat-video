function createRateLimiter({ max = 20, windowMs = 10_000 } = {}) {
  const hits = new Map();

  function isAllowed(socketId) {
    const now = Date.now();
    const timestamps = (hits.get(socketId) || []).filter(
      (t) => now - t < windowMs,
    );
    timestamps.push(now);
    hits.set(socketId, timestamps);
    return timestamps.length <= max;
  }

  isAllowed.cleanup = (socketId) => hits.delete(socketId);
  return isAllowed;
}

module.exports = { createRateLimiter };
