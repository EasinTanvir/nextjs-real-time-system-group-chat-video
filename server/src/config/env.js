const port = process.env.PORT;

const redisUrl = process.env.REDIS_URL;
const sessionSecret = process.env.SESSION_SECRET;
const isProduction = process.env.NODE_ENV === "production";
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL;

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const corsOrigin = isProduction
  ? "https://groupchat.easintanvir.com"
  : "http://localhost:3000";

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
