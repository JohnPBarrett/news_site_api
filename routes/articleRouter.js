const articleRouter = require("express").Router();
const {
  getArticle,
  patchArticle,
  getArticles,
  getArticleComments
} = require("../controllers/articles.controller");

articleRouter.route("/").get(getArticles);

articleRouter.route("/:articleId").get(getArticle).patch(patchArticle);

articleRouter.route("/:articleId/comments").get(getArticleComments)

module.exports = articleRouter;
