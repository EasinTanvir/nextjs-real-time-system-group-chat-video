const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const bcrypt = require("bcryptjs");
const { eq, and } = require("drizzle-orm");
const { db } = require("../db/client");
const { users, accounts } = require("../db/schema");
const {
  googleClientId,
  googleClientSecret,
  googleCallbackUrl,
} = require("./env");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email.toLowerCase()));

        if (!user || !user.password) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackUrl,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value?.toLowerCase();

        if (!email) {
          return done(null, false, {
            message: "No email returned from Google",
          });
        }

        // already linked?
        const [existingAccount] = await db
          .select()
          .from(accounts)
          .where(
            and(
              eq(accounts.provider, "google"),
              eq(accounts.providerAccountId, googleId),
            ),
          );

        if (existingAccount) {
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, existingAccount.userId));
          return done(null, user);
        }

        // existing user with same email -> auto-link google account
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        if (existingUser) {
          await db.insert(accounts).values({
            userId: existingUser.id,
            provider: "google",
            providerAccountId: googleId,
          });
          return done(null, existingUser);
        }

        // brand new user via google
        const [newUser] = await db
          .insert(users)
          .values({
            email,
            username: profile.displayName || email.split("@")[0],
            avatarUrl: profile.photos?.[0]?.value,
          })
          .returning();

        await db.insert(accounts).values({
          userId: newUser.id,
          provider: "google",
          providerAccountId: googleId,
        });

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = { passport };
