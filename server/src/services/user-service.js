const { and, eq, gt, ilike, or } = require("drizzle-orm");
const { db } = require("../db/client");
const { users, userSettings } = require("../db/schema");
const { AppError } = require("../utils/app-error");

const publicUser = (user) => user && ({ id: user.id, username: user.username, displayName: user.displayName, avatarUrl: user.avatarUrl, bio: user.bio, lastSeenAt: user.lastSeenAt, createdAt: user.createdAt });
const getUser = async (id) => (await db.select().from(users).where(eq(users.id, id)).limit(1))[0];
const requireUser = async (id) => { const user = await getUser(id); if (!user) throw new AppError(401, "Authenticated user was not found."); return user; };
const getMe = async (id) => {
  const user = await requireUser(id);
  const settings = (await db.select().from(userSettings).where(eq(userSettings.userId, id)).limit(1))[0];
  return { ...publicUser(user), email: user.email, settings: settings || null };
};
const updateMe = async (id, values) => {
  await requireUser(id);
  const [user] = await db.update(users).set({ ...values, updatedAt: new Date() }).where(eq(users.id, id)).returning();
  return publicUser(user);
};
const updateSettings = async (id, values) => {
  await requireUser(id);
  const [settings] = await db.insert(userSettings).values({ userId: id, ...values, updatedAt: new Date() }).onConflictDoUpdate({ target: userSettings.userId, set: { ...values, updatedAt: new Date() } }).returning();
  return settings;
};
const listUsers = async (actorId, { search, limit, cursor }) => {
  const filters = [gt(users.id, cursor || "00000000-0000-0000-0000-000000000000")];
  if (search) filters.push(or(ilike(users.username, `%${search}%`), ilike(users.displayName, `%${search}%`)));
  const rows = await db.select().from(users).where(and(...filters)).limit(limit + 1);
  const hasMore = rows.length > limit;
  const result = rows.slice(0, limit).filter((user) => user.id !== actorId).map(publicUser);
  return { items: result, nextCursor: hasMore ? rows[limit - 1]?.id || null : null };
};

module.exports = { publicUser, getUser, requireUser, getMe, updateMe, updateSettings, listUsers };
