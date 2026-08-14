const { createGroup, addGroupMembers } = require("../services/group-service");

async function createGroupHandler(req, res, next) {
  try {
    const { name, memberIds } = req.body;
    const conversation = await createGroup(req.user.id, name, memberIds);
    res.status(201).json({ success: true, data: conversation });
  } catch (err) {
    next(err);
  }
}

async function addMembersHandler(req, res, next) {
  try {
    const { memberIds } = req.body;
    const result = await addGroupMembers(
      req.params.conversationId,
      req.user.id,
      memberIds,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { createGroupHandler, addMembersHandler };
