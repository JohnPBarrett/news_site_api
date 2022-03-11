const articleRouter = require("express").Router();
const {
  getArticle,
  postArticle,
  patchArticle,
  getArticles,
  deleteArticle,
  getArticleComments,
  postArticleComment
} = require("../controllers/articles.controller");
const {
  verifyToken,
  verifyTokenAuthor,
  verifyTokenDelete
} = require("../middleware/auth");

articleRouter.route("/").get(getArticles).post(verifyTokenAuthor, postArticle);

articleRouter
  .route("/:articleId")
  .get(getArticle)
  .patch(verifyToken, patchArticle)
  .delete(verifyTokenDelete, deleteArticle);

articleRouter
  .route("/:articleId/comments")
  .get(getArticleComments)
  .post(verifyToken, postArticleComment);

module.exports = articleRouter;
