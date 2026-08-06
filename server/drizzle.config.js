require("dotenv").config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in server/.env before running Drizzle commands.");
}

/** @type {import("drizzle-kit").Config} */
module.exports = {
  dialect: "postgresql",
  schema: "./src/db/schema.js",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
};
