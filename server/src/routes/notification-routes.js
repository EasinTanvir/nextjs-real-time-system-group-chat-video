const router = require("express").Router();
const controller = require("../controllers/notification-controller");
router.get("/notifications", controller.list);
router.get("/notifications/unread-count", controller.unread);
router.patch("/notifications/read-all", controller.readAll);
router.patch("/notifications/:notificationId/read", controller.read);
module.exports = router;
