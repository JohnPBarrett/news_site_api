const {
  selectArticle,
  insertArticle,
  updateArticleVotes,
  updateArticleBody,
  removeArticle,
  selectArticles,
  selectArticleComments,
  insertArticleComment
} = require("../models/articles.models");

exports.getArticles = async (req, res, next) => {
  try {
    const articles = await selectArticles(req.query);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.postArticle = async (req, res, next) => {
  try {
    const article = await insertArticle(req.body);

    res.status(201).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const article = await selectArticle(articleId);

    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    let article;

    if ("body" in req.body) {
      const articleReturned = await selectArticle(articleId);
      if (req.user.username !== articleReturned.author) {
        return res.status(403).send("Forbidden");
      }
      article = await updateArticleBody(articleId, req.body);
    } else {
      // The handler for null cases is present in updateArticleVotes
      article = await updateArticleVotes(articleId, req.body);
    }

    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const article = await selectArticle(articleId);
    if (req.user.username !== article.author) return res.sendStatus(401);
    await removeArticle(articleId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.getArticleComments = async (req, res, next) => {
  const { articleId } = req.params;

  try {
    const comments = await selectArticleComments(articleId, req.query);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postArticleComment = async (req, res, next) => {
  const { articleId } = req.params;

  try {
    const comment = await insertArticleComment(articleId, req.body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};
