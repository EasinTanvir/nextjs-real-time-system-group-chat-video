const { eq } = require("drizzle-orm");
const { db } = require("../db/client");
const { users } = require("../db/schema");

async function updateLastSeen(userId) {
  await db
    .update(users)
    .set({ lastSeenAt: new Date() })
    .where(eq(users.id, userId));
}

module.exports = { updateLastSeen };
