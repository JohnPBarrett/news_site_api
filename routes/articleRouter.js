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
const { verifyToken } = require("../middleware/auth");

articleRouter.route("/").get(getArticles).post(postArticle);

articleRouter
  .route("/:articleId")
  .get(getArticle)
  .patch(patchArticle)
  .delete(deleteArticle);

articleRouter
  .route("/:articleId/comments")
  .get(getArticleComments)
  .post(verifyToken, postArticleComment);

module.exports = articleRouter;
