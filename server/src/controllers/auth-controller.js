const service = require("../services/auth-service");
const { asyncHandler } = require("../utils/async-handler");
const { success } = require("../utils/response");
const { AppError } = require("../utils/app-error");

const email = (value) => {
  if (typeof value !== "string") throw new AppError(422, "email is required.");
  const normalized = value.trim().toLowerCase();
  if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized))
    throw new AppError(422, "Enter a valid email address.");
  return normalized;
};

const password = (value) => {
  if (typeof value !== "string" || value.length < 6 || value.length > 72)
    throw new AppError(422, "password must be between 6 and 72 characters.");
  return value;
};

const register = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const result = await service.register({
    email: email(req.body.email),
    username,
    password: password(req.body.password),
  });
  success(res, result, 201);
});

const login = asyncHandler(async (req, res) =>
  success(
    res,
    await service.login({
      email: email(req.body.email),
      password: password(req.body.password),
    }),
  ),
);

module.exports = { register, login };
