const service = require("../services/auth-service");
const { asyncHandler } = require("../utils/async-handler");
const { success } = require("../utils/response");
const { AppError } = require("../utils/app-error");

const email = (value) => {
  if (typeof value !== "string") throw new AppError(422, "email is required.");
  const normalized = value.trim().toLowerCase();
  if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new AppError(422, "Enter a valid email address.");
  return normalized;
};
const username = (value) => {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{3,30}$/.test(value.trim())) throw new AppError(422, "username must be 3-30 letters, numbers, underscores, or hyphens.");
  return value.trim().toLowerCase();
};
const password = (value) => {
  if (typeof value !== "string" || value.length < 8 || value.length > 72) throw new AppError(422, "password must be between 8 and 72 characters.");
  return value;
};
const displayName = (value, fallback) => {
  if (value === undefined) return fallback;
  if (typeof value !== "string" || value.trim().length < 1 || value.trim().length > 100) throw new AppError(422, "displayName must be between 1 and 100 characters.");
  return value.trim();
};
const register = asyncHandler(async (req, res) => { const handle = username(req.body.username); const result = await service.register({ email: email(req.body.email), username: handle, displayName: displayName(req.body.displayName, handle), password: password(req.body.password) }); success(res, result, 201); });
const login = asyncHandler(async (req, res) => success(res, await service.login({ email: email(req.body.email), password: password(req.body.password) })));

module.exports = { register, login };
