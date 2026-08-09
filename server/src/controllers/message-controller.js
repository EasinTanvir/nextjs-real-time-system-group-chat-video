const {
  sendMessage,
  getMessages,
  markConversationRead,
  listConversations,
  getConversationById,
} = require("../services/message-service");

async function postMessage(req, res, next) {
  try {
    const message = await sendMessage(
      req.params.conversationId,
      req.user.id,
      req.body.content,
    );
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
}

async function fetchMessages(req, res, next) {
  try {
    const { cursor, limit } = req.query;
    const data = await getMessages(req.params.conversationId, req.user.id, {
      cursor,
      limit: limit ? Number(limit) : undefined,
    });
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function readConversation(req, res, next) {
  try {
    const data = await markConversationRead(
      req.params.conversationId,
      req.user.id,
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function fetchConversations(req, res, next) {
  try {
    const data = await listConversations(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function fetchConversation(req, res, next) {
  try {
    const data = await getConversationById(
      req.params.conversationId,
      req.user.id,
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  postMessage,
  fetchMessages,
  readConversation,
  fetchConversations,
  fetchConversation,
};
