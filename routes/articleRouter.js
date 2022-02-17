const articleRouter = require("express").Router();
const {
  getArticle,
  postArticle,
  patchArticle,
  getArticles,
  deleteArticle,
  getArticleComments,
  postArticleComment,
} = require("../controllers/articles.controller");


articleRouter.route("/").get( getArticles).post(postArticle);

articleRouter
  .route("/:articleId")
  .get(getArticle)
  .patch(patchArticle)
  .delete(deleteArticle);

articleRouter
  .route("/:articleId/comments")
  .get(getArticleComments)
  .post(postArticleComment);

module.exports = articleRouter;
