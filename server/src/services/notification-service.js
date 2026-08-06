const { and, desc, eq, isNull, sql } = require("drizzle-orm");
const { db } = require("../db/client");
const { notifications, users } = require("../db/schema");
const { AppError } = require("../utils/app-error");
const { publicUser } = require("./user-service");

const format = (notification, actor) => ({ ...notification, actor: publicUser(actor) });

const create = async (client, values) => {
  const [notification] = await client.insert(notifications).values(values).returning();
  const actor = notification.actorId
    ? (await client.select().from(users).where(eq(users.id, notification.actorId)).limit(1))[0]
    : null;
  return format(notification, actor);
};

const list = async (userId, limit = 10) => {
  const rows = await db.select({ notification: notifications, actor: users })
    .from(notifications).leftJoin(users, eq(users.id, notifications.actorId))
    .where(eq(notifications.recipientId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
  return rows.map(({ notification, actor }) => format(notification, actor));
};

const unreadCount = async (userId) => Number((await db.select({ count: sql`count(*)` }).from(notifications)
  .where(and(eq(notifications.recipientId, userId), isNull(notifications.readAt))))[0].count);

const markRead = async (userId, notificationIds) => {
  const filter = notificationIds?.length
    ? and(eq(notifications.recipientId, userId), sql`${notifications.id} = ANY(${notificationIds})`)
    : and(eq(notifications.recipientId, userId), isNull(notifications.readAt));
  const updated = await db.update(notifications).set({ readAt: new Date(), updatedAt: new Date() })
    .where(and(filter, isNull(notifications.readAt))).returning();
  return updated;
};

const markOneRead = async (userId, notificationId) => {
  const [updated] = await db.update(notifications).set({ readAt: new Date(), updatedAt: new Date() })
    .where(and(eq(notifications.id, notificationId), eq(notifications.recipientId, userId))).returning();
  if (!updated) throw new AppError(404, "Notification not found.");
  return updated;
};

module.exports = { create, list, unreadCount, markRead, markOneRead };
