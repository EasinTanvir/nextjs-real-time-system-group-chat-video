const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  getIncomingRequests,
  getOutgoingRequests,
  getFriends,
  getDiscoverUsers,
} = require("../controllers/friend-controller");

router.post("/friends/requests", requireAuth, sendRequest);
router.post("/friends/requests/:requestId/accept", requireAuth, acceptRequest);
router.post("/friends/requests/:requestId/reject", requireAuth, rejectRequest);
router.delete("/friends/requests/:requestId", requireAuth, cancelRequest);
// Requests sent to you (pending)
router.get("/friends/requests/incoming", requireAuth, getIncomingRequests);
// Requests you sent (pending)
router.get("/friends/requests/outgoing", requireAuth, getOutgoingRequests);

// Your friends list (with conversationId)
router.get("/friends", requireAuth, getFriends);
// All non-friend users (with friendStatus)
router.get("/users/discover", requireAuth, getDiscoverUsers);

module.exports = router;
