const { eq, and, desc, isNull } = require("drizzle-orm");
const { db } = require("../db/client");
const { notifications } = require("../db/schema");

async function createNotification(data, tx = db) {
  const [n] = await tx.insert(notifications).values(data).returning();
  return n;
}

async function listNotifications(userId) {
  return db.query.notifications.findMany({
    where: eq(notifications.recipientId, userId),
    orderBy: desc(notifications.createdAt),
    limit: 50,
  });
}

async function getUnreadCount(userId) {
  const rows = await db.query.notifications.findMany({
    where: and(
      eq(notifications.recipientId, userId),
      isNull(notifications.readAt),
    ),
  });
  return rows.length;
}

async function markAsRead(notificationId, userId) {
  const [updated] = await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.recipientId, userId),
      ),
    )
    .returning();
  return updated;
}

async function markAllAsRead(userId) {
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(eq(notifications.recipientId, userId), isNull(notifications.readAt)),
    );
}

module.exports = {
  createNotification,
  listNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
