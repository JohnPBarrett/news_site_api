const articleRouter = require("express").Router();
const { getArticle, patchArticle } = require("../controllers/articles.controller");

articleRouter.route("/:articleId").get(getArticle).patch(patchArticle);

module.exports = articleRouter;
