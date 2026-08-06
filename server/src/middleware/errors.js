const { AppError } = require("../utils/app-error");

const notFound = (req, _res, next) => next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
const errorHandler = (error, _req, res, _next) => {
  const pgCode = error.code;
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error.";
  if (pgCode === "23505") { statusCode = 409; message = "This resource already exists."; }
  if (pgCode === "23503") { statusCode = 409; message = "The related resource cannot be changed."; }
  if (pgCode === "23514") { statusCode = 422; message = "The request violates a data constraint."; }
  if (statusCode >= 500) console.error(error);
  const payload = { success: false, message: statusCode >= 500 ? "Internal server error." : message };
  if (error.errors && statusCode < 500) payload.errors = error.errors;
  res.status(statusCode).json(payload);
};

module.exports = { notFound, errorHandler };
