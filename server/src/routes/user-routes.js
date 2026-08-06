const router = require("express").Router();
const controller = require("../controllers/user-controller");
router.get("/me", controller.getMe);
router.patch("/me", controller.patchMe);
router.get("/me/settings", controller.getSettings);
router.patch("/me/settings", controller.patchSettings);
router.get("/users", controller.listUsers);
router.get("/users/:userId", controller.getUser);
module.exports = router;
