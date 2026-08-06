const { verifyAccessToken } = require('../../utils/jwt');

const authenticationError = () => {
  const error = new Error('Authentication is required.');
  error.data = { code: 'UNAUTHORIZED' };
  return error;
};

const requireSocketAuth = (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (typeof token !== 'string' || !token.trim()) return next(authenticationError());

  try {
    const payload = verifyAccessToken(token.trim());
    if (!payload || typeof payload.sub !== 'string') return next(authenticationError());
    socket.data.userId = payload.sub;
    return next();
  } catch (_error) {
    return next(authenticationError());
  }
};

module.exports = { requireSocketAuth };
