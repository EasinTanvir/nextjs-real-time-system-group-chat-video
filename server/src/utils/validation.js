const { AppError } = require("./app-error");

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const uuid = (value, field = "id") => {
  if (!UUID.test(String(value || "")))
    throw new AppError(400, `Invalid ${field}.`);
  return value;
};
const string = (
  value,
  field,
  { required = false, max = 500, min = 1 } = {},
) => {
  if (value === undefined || value === null) {
    if (required) throw new AppError(422, `${field} is required.`);
    return undefined;
  }
  if (typeof value !== "string")
    throw new AppError(422, `${field} must be a string.`);
  const normalized = value.trim();
  if (normalized.length < min || normalized.length > max)
    throw new AppError(
      422,
      `${field} must be between ${min} and ${max} characters.`,
    );
  return normalized;
};
const boolean = (value, field) => {
  if (typeof value !== "boolean")
    throw new AppError(422, `${field} must be a boolean.`);
  return value;
};
const page = (query) => {
  const limit = Number(query.limit || 25);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100)
    throw new AppError(400, "limit must be an integer between 1 and 100.");
  return {
    limit,
    cursor: query.cursor ? uuid(query.cursor, "cursor") : undefined,
  };
};
const oneOf = (value, values, field) => {
  if (!values.includes(value))
    throw new AppError(422, `${field} must be one of: ${values.join(", ")}.`);
  return value;
};

module.exports = { uuid, string, boolean, page, oneOf };
