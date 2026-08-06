const { AppError } = require("../../utils/app-error");

const success = (data) => ({ success: true, data });
const failure = (error) => ({
  success: false,
  message:
    error instanceof AppError && error.statusCode < 500
      ? error.message
      : "Unable to process this real-time request.",
  code: error instanceof AppError ? String(error.statusCode) : "INTERNAL_ERROR",
});

const acknowledge = (callback, response) => {
  if (typeof callback === "function") callback(response);
};

const registerEvent = (socket, event, handler) => {
  socket.on(event, async (payload, callback) => {
    try {
      acknowledge(callback, success(await handler(payload)));
    } catch (error) {
      const status = error instanceof AppError ? error.statusCode : 500;
      const message =
        error instanceof AppError
          ? error.message
          : "Unexpected socket handler failure.";
      console.error(
        `[socket] event=${event} userId=${socket.data.userId} status=${status} message=${message}`,
      );
      acknowledge(callback, failure(error));
    }
  });
};

module.exports = { registerEvent };
