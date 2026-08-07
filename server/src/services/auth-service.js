const bcrypt = require("bcryptjs");
const { eq } = require("drizzle-orm");
const { db } = require("../db/client");
const { users, accounts, userSettings } = require("../db/schema");

const SALT_ROUNDS = 12;

async function register({ email, username, password }) {
  const normalizedEmail = email.toLowerCase();

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail));
  if (existing) {
    const error = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await db.transaction(async (tx) => {
    const [newUser] = await tx
      .insert(users)
      .values({ email: normalizedEmail, username, password: hashedPassword })
      .returning();

    await tx.insert(accounts).values({
      userId: newUser.id,
      provider: "local",
      providerAccountId: newUser.id,
    });

    await tx.insert(userSettings).values({ userId: newUser.id });

    return newUser;
  });

  return sanitizeUser(user);
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

module.exports = { register, sanitizeUser };
