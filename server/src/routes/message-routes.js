const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  postMessage,
  fetchMessages,
  readConversation,
  fetchConversations,
} = require("../controllers/message-controller");

// 	List conversations, last message, unread count
router.get("/conversations", requireAuth, fetchConversations);
// Paginated messages
router.get(
  "/conversations/:conversationId/messages",
  requireAuth,
  fetchMessages,
);

router.post(
  "/conversations/:conversationId/messages",
  requireAuth,
  postMessage,
);
// 	Mark conversation read
router.post(
  "/conversations/:conversationId/read",
  requireAuth,
  readConversation,
);

module.exports = router;
