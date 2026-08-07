const bcrypt = require("bcryptjs");
const { eq } = require("drizzle-orm");
const { db } = require("../db/client");
const { users, accounts, userSettings } = require("../db/schema");

const SALT_ROUNDS = 12;

async function register({ email, username, password }) {
  try {
    const normalizedEmail = email.toLowerCase();

    console.log("=== REGISTER START ===");
    console.log("Email:", normalizedEmail);

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    console.log("Existing user:", existing);

    if (existing) {
      const error = new Error("Email already in use");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    console.log("Password hashed");

    // Debug imports
    console.log("users table:", !!users);
    console.log("accounts table:", !!accounts);
    console.log("userSettings table:", !!userSettings);

    const user = await db.transaction(async (tx) => {
      try {
        console.log("Creating user...");

        const [newUser] = await tx
          .insert(users)
          .values({
            email: normalizedEmail,
            username,
            password: hashedPassword,
          })
          .returning();

        console.log("New user:", newUser);

        console.log("Creating account...");

        await tx.insert(accounts).values({
          userId: newUser.id,
          provider: "local",
          providerAccountId: newUser.id,
        });

        console.log("Account created");

        console.log("Creating user settings...");

        await tx.insert(userSettings).values({
          userId: newUser.id,
        });

        console.log("User settings created");

        return newUser;
      } catch (err) {
        console.error("=== TRANSACTION ERROR ===");
        console.error(err);
        console.error(err.stack);
        throw err;
      }
    });

    console.log("=== REGISTER SUCCESS ===");

    return sanitizeUser(user);
  } catch (err) {
    console.error("=== REGISTER ERROR ===");
    console.error(err);
    console.error(err.stack);
    throw err;
  }
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

module.exports = { register, sanitizeUser };
