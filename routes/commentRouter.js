const commentRouter = require("express").Router();
const {
  deleteComment,
  patchComment,
  getComments,
  getComment
} = require("../controllers/comments.controller");
const { verifyTokenDelete, verifyToken } = require("../middleware/auth");

commentRouter.route("/").get(getComments);
commentRouter
  .route("/:comment_id")
  .delete(verifyTokenDelete, deleteComment)
  .patch(verifyToken, patchComment)
  .get(getComment);

module.exports = commentRouter;
