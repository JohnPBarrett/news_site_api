const articleRouter = require("express").Router();
const { getArticle } = require("../controllers/articles.controller");

articleRouter.route("/:articleId").get(getArticle);

module.exports = articleRouter;
