const service = require("../services/friend-service");
const { asyncHandler } = require("../utils/async-handler");
const { success } = require("../utils/response");
const { oneOf, uuid } = require("../utils/validation");
const { emitToUser } = require("../socket");
const { EVENTS } = require("../socket/events");
const create = asyncHandler(async (req, res) => {
  const result = await service.createRequest(
    req.userId,
    uuid(req.body.receiverId, "receiverId"),
  );
  emitToUser(result.request.receiverId, EVENTS.FRIENDSHIP_UPDATED, {
    type: "request_received",
    request: result.request,
  });
  emitToUser(result.request.receiverId, EVENTS.NOTIFICATION_NEW, {
    notification: result.notification,
  });
  success(res, result.request, 201);
});
const list = asyncHandler(async (req, res) =>
  success(
    res,
    await service.listRequests(
      req.userId,
      req.query.type === "sent" ? "sent" : "received",
    ),
  ),
);
const respond = asyncHandler(async (req, res) => {
  const result = await service.respond(
    req.userId,
    uuid(req.params.requestId, "requestId"),
    oneOf(req.body.status, ["accepted", "rejected"], "status"),
  );
  const ids = [result.request.senderId, result.request.receiverId];
  ids.forEach((userId) =>
    emitToUser(userId, EVENTS.FRIENDSHIP_UPDATED, {
      type: result.request.status,
      request: result.request,
    }),
  );
  if (result.conversation)
    ids.forEach((userId) =>
      emitToUser(userId, EVENTS.CONVERSATION_AVAILABLE, {
        conversation: result.conversation,
      }),
    );
  emitToUser(result.notification.recipientId, EVENTS.NOTIFICATION_NEW, {
    notification: result.notification,
  });
  success(res, result.request);
});
const cancel = asyncHandler(async (req, res) => {
  await service.cancel(req.userId, uuid(req.params.requestId, "requestId"));
  res.status(204).send();
});
const friends = asyncHandler(async (req, res) =>
  success(res, await service.listFriends(req.userId)),
);
const remove = asyncHandler(async (req, res) => {
  await service.removeFriend(req.userId, uuid(req.params.userId, "userId"));
  res.status(204).send();
});
module.exports = { create, list, respond, cancel, friends, remove };
