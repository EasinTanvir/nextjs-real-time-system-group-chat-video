const bcrypt = require("bcryptjs");
const { ilike, or } = require("drizzle-orm");
const { db } = require("../db/client");
const { users, userSettings } = require("../db/schema");
const { AppError } = require("../utils/app-error");
const { signAccessToken, expiresIn } = require("../utils/jwt");
const { publicUser } = require("./user-service");

const credentialError = () => new AppError(401, "Invalid email or password.");
const authResult = (user) => ({
  token: signAccessToken(user.id),
  tokenType: "Bearer",
  expiresIn,
  user: publicUser(user),
});
const register = async ({ email, username, displayName, password }) =>
  db.transaction(async (tx) => {
    const duplicate = (
      await tx
        .select({ id: users.id })
        .from(users)
        .where(or(ilike(users.email, email), ilike(users.username, username)))
        .limit(1)
    )[0];
    if (duplicate)
      throw new AppError(
        409,
        "An account with that email or username already exists.",
      );
    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await tx
      .insert(users)
      .values({ email, username, displayName, passwordHash })
      .returning();
    await tx.insert(userSettings).values({ userId: user.id });
    return authResult(user);
  });
const login = async ({ email, password }) => {
  const user = (
    await db.select().from(users).where(ilike(users.email, email)).limit(1)
  )[0];
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    throw credentialError();
  return authResult(user);
};

module.exports = { register, login };
