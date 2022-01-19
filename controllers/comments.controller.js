const { removeComment } = require("../models/comments.model");

exports.deleteComment = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    await removeComment(comment_id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
