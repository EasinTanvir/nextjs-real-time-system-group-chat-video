const { createGroup } = require("../services/group-service");

async function createGroupHandler(req, res, next) {
  try {
    const { name, memberIds } = req.body;
    const conversation = await createGroup(req.user.id, name, memberIds);
    res.status(201).json({ success: true, data: conversation });
  } catch (err) {
    next(err);
  }
}

module.exports = { createGroupHandler };
