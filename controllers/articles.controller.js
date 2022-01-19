const {
  selectArticle,
  updateArticle,
  selectArticles,
  selectArticleComments,
  insertArticleComment,
} = require("../models/articles.models");

exports.getArticles = async (req, res, next) => {
  try {
    const articles = await selectArticles(req.query);
    res.status(200).send({ articles });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
exports.getArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const articleData = await selectArticle(articleId);

    res.status(200).send(articleData);
  } catch (err) {
    next(err);
  }
};

exports.patchArticle = async (req, res, next) => {
  const validBodyFields = ["inc_votes"];

  try {
    for (let key in req.body) {
      // To handle case where body has invalid fields
      if (!validBodyFields.includes(key)) {
        throw "Invalid field body";
      }
    }
    const { articleId } = req.params;
    const { inc_votes } = req.body;
    const updatedArticle = await updateArticle(articleId, inc_votes);

    res.status(201).send(updatedArticle);
  } catch (err) {
    next(err);
  }
};

exports.getArticleComments = async (req, res, next) => {
  const { articleId } = req.params;

  try {
    const comments = await selectArticleComments(articleId);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postArticleComment = async (req, res, next) => {
  const { articleId } = req.params;

  try {
    const newComment = await insertArticleComment(articleId, req.body);
    res.status(201).send(newComment);
  } catch (err) {
    next(err);
  }
};
