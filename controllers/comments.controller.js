const { removeComment, updateComment } = require("../models/comments.model");

exports.deleteComment = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    await removeComment(comment_id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.patchComment = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    const comment = await updateComment(comment_id, req.body);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};
