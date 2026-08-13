const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { createGroupHandler } = require("../controllers/group-controller");

router.post("/groups", requireAuth, createGroupHandler);

module.exports = router;
