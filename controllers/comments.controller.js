const {
  removeComment,
  updateCommentVotes,
  updateCommentBody,
  selectComments
} = require("../models/comments.model");

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
    let comment;
    if ("body" in req.body) {
      comment = await updateCommentBody(comment_id, req.body);
    } else {
      comment = await updateCommentVotes(comment_id, req.body);
    }
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const comments = await selectComments();
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
