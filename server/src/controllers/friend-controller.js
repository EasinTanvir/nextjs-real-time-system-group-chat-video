const service = require("../services/friend-service"); const { asyncHandler } = require("../utils/async-handler"); const { success } = require("../utils/response"); const { oneOf, uuid } = require("../utils/validation");
const create = asyncHandler(async (req, res) => success(res, await service.createRequest(req.userId, uuid(req.body.receiverId, 'receiverId')), 201));
const list = asyncHandler(async (req, res) => success(res, await service.listRequests(req.userId, req.query.type === 'sent' ? 'sent' : 'received')));
const respond = asyncHandler(async (req, res) => success(res, await service.respond(req.userId, uuid(req.params.requestId, 'requestId'), oneOf(req.body.status, ['accepted', 'rejected'], 'status'))));
const cancel = asyncHandler(async (req, res) => { await service.cancel(req.userId, uuid(req.params.requestId, 'requestId')); res.status(204).send(); });
const friends = asyncHandler(async (req, res) => success(res, await service.listFriends(req.userId)));
const remove = asyncHandler(async (req, res) => { await service.removeFriend(req.userId, uuid(req.params.userId, 'userId')); res.status(204).send(); });
module.exports = { create, list, respond, cancel, friends, remove };
