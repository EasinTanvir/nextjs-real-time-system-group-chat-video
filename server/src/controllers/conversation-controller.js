const service = require("../services/conversation-service");
const { asyncHandler } = require("../utils/async-handler");
const { success } = require("../utils/response");
const { oneOf, page, string, uuid } = require("../utils/validation");
const { AppError } = require("../utils/app-error");
const id = (req) => uuid(req.params.conversationId, "conversationId");
const list = asyncHandler(async (req, res) =>
  success(res, await service.list(req.userId, page(req.query))),
);
const create = asyncHandler(async (req, res) => {
  if (req.body.type !== "group")
    throw new AppError(
      422,
      "Use /conversations/direct for direct conversations; type must be group.",
    );
  const memberIds = Array.isArray(req.body.memberIds)
    ? req.body.memberIds.map((value) => uuid(value, "memberIds"))
    : [];
  const values = {
    name: string(req.body.name, "name", { required: true, max: 100 }),
    memberIds,
  };
  if (req.body.description !== undefined)
    values.description = string(req.body.description, "description", {
      max: 500,
      min: 0,
    });
  if (req.body.avatarUrl !== undefined)
    values.avatarUrl = string(req.body.avatarUrl, "avatarUrl", {
      max: 2048,
      min: 1,
    });
  success(res, await service.createGroup(req.userId, values), 201);
});
const direct = asyncHandler(async (req, res) => {
  const result = await service.createDirect(
    req.userId,
    uuid(req.body.userId, "userId"),
  );
  success(res, result.conversation, result.created ? 201 : 200);
});
const get = asyncHandler(async (req, res) =>
  success(res, await service.details(req.userId, id(req))),
);
const patch = asyncHandler(async (req, res) => {
  const values = {};
  for (const key of ["name", "description", "avatarUrl"])
    if (req.body[key] !== undefined)
      values[key] = string(req.body[key], key, {
        required: key === "name",
        max: key === "description" ? 500 : key === "avatarUrl" ? 2048 : 100,
        min: key === "description" ? 0 : 1,
      });
  if (!Object.keys(values).length)
    throw new AppError(422, "Provide at least one editable field.");
  success(res, await service.update(req.userId, id(req), values));
});
const remove = asyncHandler(async (req, res) => {
  await service.remove(req.userId, id(req));
  res.status(204).send();
});
const members = asyncHandler(async (req, res) =>
  success(res, await service.listMembers(req.userId, id(req))),
);
const addMember = asyncHandler(async (req, res) =>
  success(
    res,
    await service.addMember(
      req.userId,
      id(req),
      uuid(req.body.userId, "userId"),
    ),
    201,
  ),
);
const patchMember = asyncHandler(async (req, res) =>
  success(
    res,
    await service.updateMember(
      req.userId,
      id(req),
      uuid(req.params.userId, "userId"),
      oneOf(req.body.role, ["admin", "member"], "role"),
    ),
  ),
);
const removeMember = asyncHandler(async (req, res) => {
  await service.removeMember(
    req.userId,
    id(req),
    uuid(req.params.userId, "userId"),
  );
  res.status(204).send();
});
module.exports = {
  list,
  create,
  direct,
  get,
  patch,
  remove,
  members,
  addMember,
  patchMember,
  removeMember,
};
