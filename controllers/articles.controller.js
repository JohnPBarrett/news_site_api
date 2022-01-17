const { selectArticle } = require("../models/articles.models");

exports.getArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const articleData = await selectArticle(articleId);

    res.status(200).send(articleData);
  } catch (err) {
    next(err);
  }
};
