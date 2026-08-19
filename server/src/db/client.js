const path = require("node:path");
const dotenv = require("dotenv");
const { Pool } = require("pg");

const { drizzle } = require("drizzle-orm/node-postgres");
const schema = require("./schema");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in server/.env before creating a database client.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

const db = drizzle({ client: pool, schema });

module.exports = { db, pool };
