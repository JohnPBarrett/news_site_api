const articleRouter = require("express").Router();
const {
  getArticle,
  patchArticle,
  getArticles,
} = require("../controllers/articles.controller");

articleRouter.route("/").get(getArticles);

articleRouter.route("/:articleId").get(getArticle).patch(patchArticle);

module.exports = articleRouter;
