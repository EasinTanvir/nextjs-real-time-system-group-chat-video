const router = require("express").Router();
const { login, register } = require("../controllers/auth-controller");

router.post("/auth/register", register);
router.post("/auth/login", login);

module.exports = router;
