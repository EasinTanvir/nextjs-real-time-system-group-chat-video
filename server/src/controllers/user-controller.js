const service = require("../services/user-service");
const { asyncHandler } = require("../utils/async-handler");
const { success } = require("../utils/response");
const { boolean, page, string, uuid } = require("../utils/validation");
const { AppError } = require("../utils/app-error");
const getMe = asyncHandler(async (req, res) =>
  success(res, await service.getMe(req.userId)),
);
const patchMe = asyncHandler(async (req, res) => {
  const values = {};
  for (const key of ["displayName", "avatarUrl", "bio"])
    if (req.body[key] !== undefined)
      values[key] = string(req.body[key], key, {
        max: key === "bio" ? 500 : 100,
        required: key === "displayName",
      });
  if (!Object.keys(values).length)
    throw new AppError(422, "Provide at least one editable field.");
  success(res, await service.updateMe(req.userId, values));
});
const getSettings = asyncHandler(async (req, res) =>
  success(res, (await service.getMe(req.userId)).settings),
);
const patchSettings = asyncHandler(async (req, res) => {
  const values = {};
  if (req.body.theme !== undefined) {
    if (!["light", "dark", "system"].includes(req.body.theme))
      throw new AppError(422, "theme must be light, dark, or system.");
    values.theme = req.body.theme;
  }
  for (const key of ["notificationsEnabled", "readReceiptsEnabled"])
    if (req.body[key] !== undefined) values[key] = boolean(req.body[key], key);
  if (!Object.keys(values).length)
    throw new AppError(422, "Provide at least one settings field.");
  success(res, await service.updateSettings(req.userId, values));
});
const listUsers = asyncHandler(async (req, res) =>
  success(
    res,
    await service.listUsers(req.userId, {
      ...page(req.query),
      search: req.query.search
        ? string(req.query.search, "search", { max: 100 })
        : undefined,
    }),
  ),
);
const getUser = asyncHandler(async (req, res) => {
  const user = await service.getUser(uuid(req.params.userId, "userId"));
  if (!user) throw new AppError(404, "User not found.");
  success(res, service.publicUser(user));
});
module.exports = {
  getMe,
  patchMe,
  getSettings,
  patchSettings,
  listUsers,
  getUser,
};
