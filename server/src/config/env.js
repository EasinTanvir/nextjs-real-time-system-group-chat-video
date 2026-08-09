const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const sessionSecret = process.env.SESSION_SECRET || "your-secret-key";
const isProduction = process.env.NODE_ENV === "production";
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL;

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

module.exports = {
  port,
  corsOrigin,
  redisUrl,
  sessionSecret,
  isProduction,
  googleClientId,
  googleClientSecret,
  googleCallbackUrl,
  SMTP_USER,
  SMTP_PASS,
};
