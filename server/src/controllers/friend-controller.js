const {
  sendFriendRequest,
  respondToFriendRequest,
  cancelFriendRequest,
  listIncomingRequests,
  listOutgoingRequests,
  listFriends,
  discoverUsers,
} = require("../services/friend-service");

async function sendRequest(req, res, next) {
  try {
    const { receiverId } = req.body;
    if (!receiverId) {
      return res
        .status(400)
        .json({ success: false, message: "receiverId is required" });
    }
    const request = await sendFriendRequest(req.user.id, receiverId);
    res.status(201).json({ success: true, data: request });
  } catch (err) {
    next(err);
  }
}

async function acceptRequest(req, res, next) {
  try {
    const result = await respondToFriendRequest(
      req.params.requestId,
      req.user.id,
      "accept",
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function rejectRequest(req, res, next) {
  try {
    const result = await respondToFriendRequest(
      req.params.requestId,
      req.user.id,
      "reject",
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function cancelRequest(req, res, next) {
  try {
    const updated = await cancelFriendRequest(
      req.params.requestId,
      req.user.id,
    );
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

async function getIncomingRequests(req, res, next) {
  try {
    const data = await listIncomingRequests(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getOutgoingRequests(req, res, next) {
  try {
    const data = await listOutgoingRequests(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getFriends(req, res, next) {
  try {
    const data = await listFriends(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getDiscoverUsers(req, res, next) {
  try {
    const data = await discoverUsers(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  sendRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  getIncomingRequests,
  getOutgoingRequests,
  getFriends,
  getDiscoverUsers,
};
