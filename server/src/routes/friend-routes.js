const router = require("express").Router();
const controller = require("../controllers/friend-controller");
router.route("/friend-requests").get(controller.list).post(controller.create);
router.patch("/friend-requests/:requestId", controller.respond);
router.delete("/friend-requests/:requestId", controller.cancel);
router.get("/friends", controller.friends);
router.delete("/friends/:userId", controller.remove);
module.exports = router;
