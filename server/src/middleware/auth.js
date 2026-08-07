function requireAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    console.log("Authenticated user:", req.user);
    return next();
  }
  return res
    .status(401)
    .json({ success: false, message: "Authentication required" });
}

module.exports = { requireAuth };
