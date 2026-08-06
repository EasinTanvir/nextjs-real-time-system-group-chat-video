const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const issuer = process.env.JWT_ISSUER || "chat-api";
const audience = process.env.JWT_AUDIENCE || "chat-client";
const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

if (!secret || secret.length < 32) {
  throw new Error(
    "JWT_SECRET must be set to a random value of at least 32 characters.",
  );
}

const signAccessToken = (userId) =>
  jwt.sign({}, secret, {
    algorithm: "HS256",
    subject: userId,
    issuer,
    audience,
    expiresIn,
  });
const verifyAccessToken = (token) =>
  jwt.verify(token, secret, { algorithms: ["HS256"], issuer, audience });

module.exports = { signAccessToken, verifyAccessToken, expiresIn };
