const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  postMessage,
  fetchMessages,
  readConversation,
  fetchConversations,
  fetchConversation,
} = require("../controllers/message-controller");

// 	List conversations, last message, unread count
router.get("/conversations", requireAuth, fetchConversations);

router.get("/conversations/:conversationId", requireAuth, fetchConversation);

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
