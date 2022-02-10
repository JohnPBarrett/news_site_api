const {
  selectArticle,
  insertArticle,
  updateArticle,
  removeArticle,
  selectArticles,
  selectArticleComments,
  insertArticleComment,
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

    res.status(201).send(article);
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

    const article = await updateArticle(articleId, req.body);

    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
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
