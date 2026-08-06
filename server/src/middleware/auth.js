const { AppError } = require("../utils/app-error");
const { verifyAccessToken } = require("../utils/jwt");

const requireAuth = (req, _res, next) => {
  const authorization = req.get("authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) return next(new AppError(401, "Authentication is required."));
  const token = authorization.slice(7).trim();
  if (!token) return next(new AppError(401, "Authentication is required."));
  try {
    const payload = verifyAccessToken(token);
    if (!payload || typeof payload.sub !== "string") throw new Error("Token subject is invalid.");
    req.auth = { userId: payload.sub };
    req.userId = payload.sub;
  } catch (_error) {
    return next(new AppError(401, "Authentication is required."));
  }
  return next();
};

module.exports = { requireAuth };
