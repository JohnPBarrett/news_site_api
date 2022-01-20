const articleRouter = require("express").Router();
const {
  getArticle,
  postArticle,
  patchArticle,
  getArticles,
  getArticleComments,
  postArticleComment,
} = require("../controllers/articles.controller");

articleRouter.route("/").get(getArticles).post(postArticle);

articleRouter.route("/:articleId").get(getArticle).patch(patchArticle);

articleRouter
  .route("/:articleId/comments")
  .get(getArticleComments)
  .post(postArticleComment);

module.exports = articleRouter;
