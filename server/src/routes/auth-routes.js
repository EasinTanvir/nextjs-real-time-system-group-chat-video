const router = require("express").Router();
const passport = require("passport");
const {
  register,
  login,
  logout,
  googleCallback,
} = require("../controllers/auth-controller");

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: true }),
  googleCallback,
);

module.exports = router;
