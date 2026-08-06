const { AppError } = require("../utils/app-error");

// Integrate the owner's verified auth middleware before this middleware. It must set req.auth.userId.
const requireAuth = (req, _res, next) => {
  if (!req.auth || !req.auth.userId)
    return next(new AppError(401, "Authentication is required."));
  req.userId = req.auth.userId;
  return next();
};

module.exports = { requireAuth };
