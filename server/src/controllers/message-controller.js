const service = require("../services/message-service");
const { asyncHandler } = require("../utils/async-handler");
const { success } = require("../utils/response");
const { page, string, uuid } = require("../utils/validation");
const conversationId = (req) =>
  uuid(req.params.conversationId, "conversationId");
const list = asyncHandler(async (req, res) =>
  success(
    res,
    await service.list(req.userId, conversationId(req), page(req.query)),
  ),
);
const create = asyncHandler(async (req, res) => {
  const result = await service.create(
    req.userId,
    conversationId(req),
    string(req.body.content, "content", { required: true, max: 5000 }),
  );
  success(res, result.message, 201);
});
const patch = asyncHandler(async (req, res) =>
  success(
    res,
    await service.edit(
      req.userId,
      conversationId(req),
      uuid(req.params.messageId, "messageId"),
      string(req.body.content, "content", { required: true, max: 5000 }),
    ),
  ),
);
const remove = asyncHandler(async (req, res) => {
  await service.remove(
    req.userId,
    conversationId(req),
    uuid(req.params.messageId, "messageId"),
  );
  res.status(204).send();
});
const read = asyncHandler(async (req, res) =>
  success(
    res,
    await service.markRead(
      req.userId,
      conversationId(req),
      uuid(req.body.messageId, "messageId"),
    ),
  ),
);
module.exports = { list, create, patch, remove, read };
