const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  fetchNotifications,
  fetchUnreadCount,
  readNotification,
  readAllNotifications,
} = require("../controllers/notification-controller");

router.get("/notifications", requireAuth, fetchNotifications);
router.get("/notifications/unread-count", requireAuth, fetchUnreadCount);
router.post(
  "/notifications/:notificationId/read",
  requireAuth,
  readNotification,
);
router.post("/notifications/read-all", requireAuth, readAllNotifications);

module.exports = router;
