const {
  listNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../services/notification-service");

async function fetchNotifications(req, res, next) {
  try {
    const data = await listNotifications(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function fetchUnreadCount(req, res, next) {
  try {
    const count = await getUnreadCount(req.user.id);
    res.status(200).json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
}

async function readNotification(req, res, next) {
  try {
    const data = await markAsRead(req.params.notificationId, req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function readAllNotifications(req, res, next) {
  try {
    await markAllAsRead(req.user.id);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  fetchNotifications,
  fetchUnreadCount,
  readNotification,
  readAllNotifications,
};
