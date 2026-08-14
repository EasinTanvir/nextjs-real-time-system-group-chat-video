const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  createGroupHandler,
  addMembersHandler,
} = require("../controllers/group-controller");

router.post("/groups", requireAuth, createGroupHandler);
router.post("/groups/:conversationId/members", requireAuth, addMembersHandler);
module.exports = router;
