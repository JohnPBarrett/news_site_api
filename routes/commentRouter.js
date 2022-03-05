const commentRouter = require("express").Router();
const {
  deleteComment,
  patchComment,
  getComments
} = require("../controllers/comments.controller");

commentRouter.route("/").get(getComments)
commentRouter.route("/:comment_id").delete(deleteComment).patch(patchComment);

module.exports = commentRouter;
