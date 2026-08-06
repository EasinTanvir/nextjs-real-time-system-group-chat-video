const service = require("../services/notification-service");
const { asyncHandler } = require("../utils/async-handler");
const { success } = require("../utils/response");
const { uuid } = require("../utils/validation");

const list = asyncHandler(async (req, res) => success(res, await service.list(req.userId, 10)));
const unread = asyncHandler(async (req, res) => success(res, { count: await service.unreadCount(req.userId) }));
const read = asyncHandler(async (req, res) => success(res, await service.markOneRead(req.userId, uuid(req.params.notificationId, "notificationId"))));
const readAll = asyncHandler(async (req, res) => success(res, await service.markRead(req.userId)));

module.exports = { list, unread, read, readAll };
